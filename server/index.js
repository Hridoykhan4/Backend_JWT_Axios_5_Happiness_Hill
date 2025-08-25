require('dotenv').config()
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;


/* Options Start */
const corsOptions = {
    origin: ['http://localhost:5173', "https://hotel-happiness-hill.web.app", "https://hotel-happiness-hill.firebaseapp.com"],
    credentials: true,
    optionsSuccessStatus: 200
}

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? "none" : 'strict'
}

/* Options End */


// MiddleWare Start
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// Custom
const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    if (!token) {
        return res.status(401).send({ message: 'Unauthorized Access' })
    }
    jwt.verify(token, process.env.HAPPINESS_ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized Access' })
        }
        req.user = decoded
        next()
    })
}


// MiddleWare End

const uri = `mongodb+srv://${process.env.HAPPINESS_USER}:${process.env.HAPPINESS_PASS}@happiness-hill.1es2bek.mongodb.net/?retryWrites=true&w=majority&appName=Happiness-Hill`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const roomCollection = client.db('HappinessHill').collection('rooms')
        const customerCollection = client.db('HappinessHill').collection('customers')
        const reviewCollection = client.db('HappinessHill').collection('reviews')
        const userCollection = client.db('HappinessHill').collection('users')

        /* JWT related APIs start */

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.HAPPINESS_ACCESS_TOKEN);
            res.cookie('token', token, cookieOptions).send({ success: true })
        })

        app.get('/logout', (req, res) => {
            res.clearCookie('token', { ...cookieOptions, maxAge: 0 }).send({ signOut: true });
        })

        /* JWT related APIs end*/



        /* Pagination APIs start */

        app.get('/roomCount', async (req, res) => {
            const { searchText, minPrice, maxPrice } = req.query;
            let query = {};
            if (searchText) query.title = { $regex: searchText, $options: "i" };
            if (minPrice && maxPrice) {
                query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
            }
            const count = await roomCollection.countDocuments(query)
            res.send({ count });

        })


        /* Pagination APIs end*/


        /* Room related APIs start */
        app.get('/rooms', async (req, res) => {
            const { featuredRooms, sortBy, searchText, minPrice, maxPrice } = req.query;
            let page = parseInt(req.query.page) - 1 || 0
            let size = parseInt(req.query.size) || 4;
            let sort = {};
            let query = {};

            if (searchText) query.title = { $regex: searchText, $options: "i" };

            if (minPrice && maxPrice) {
                query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
            }

            if (sortBy === 'priceHighToLow') sort.price = -1

            if (sortBy === 'priceLowToHigh') sort.price = 1

            let cursor = roomCollection.find(query)
            if (featuredRooms === 'featured') {
                cursor = cursor.sort({ "price": -1 }).limit(5);
                const result = await cursor.toArray();
                res.send(result)
            }
            const result = await cursor.sort(sort).skip(page * size).limit(size).toArray()
            res.send(result)
        })

        // Get a single room
        app.get('/rooms/:id', async (req, res) => {
            const id = req.params.id;
            const result = await roomCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        })

        // Get all post by the owner
        app.get('/my-posted-rooms/:email', verifyToken, async (req, res) => {
            const email = req.params.email;
            if (req.user.email !== email) {
                return res.status(403).send({ message: 'Forbidden Access' })
            }
            const result = await roomCollection.find({ 'ownerInfo.email': email }).toArray();
            res.send(result)
        })

        // Update a room by owner
        app.put('/rooms/:id', async (req, res) => {
            const room = req.body;
            const filter = { _id: new ObjectId(req.params.id) };
            const updateRoom = {
                $set: room
            }
            const result = await roomCollection.updateOne(filter, updateRoom);
            res.send(result)
        })

        // Delete a room by owner
        app.delete('/rooms/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) };
            const result = await roomCollection.deleteOne(query);
            res.send(result);
        })

        // Post a room
        app.post('/room', async (req, res) => {
            res.send(await roomCollection.insertOne(req.body))
        })


        /* Room related APIs end */


        /* Customer related APIs start */

        // Request for a room
        app.post('/room-request', async (req, res) => {
            const room = req.body;
            const duplicateCheck = await customerCollection.findOne({ 'roomInfo.roomId': room.roomInfo.roomId, "customerInfo.email": room.customerInfo.email });
            if (duplicateCheck) {
                return res.status(409).send({ message: 'Already booked the room' })
            }
            const result = await customerCollection.insertOne(room);
            res.send(result)
        })

        app.get('/my-bookings/:email', verifyToken, async (req, res) => {
            if (req.user.email !== req.params.email)
                return res.status(403).send({ message: 'Forbidden Access' })

            res.send(await customerCollection.find({ 'customerInfo.email': req.params.email }).toArray())
        })


        app.get('/dashboard-bookings', verifyToken, async (req, res) => {
            if (req.user?.email !== 'hridoykhan148385@gmail.com') {
                return res.status(403).send({ message: 'Forbidden Access' })

            }
            const result = await customerCollection.find({ 'roomInfo.ownerEmail': 'hridoykhan148385@gmail.com' }).toArray();
            res.send(result)
        })

        // PATCH /approve-booking/:id
        app.patch('/approve-booking/:id', async (req, res) => {
            try {
                const bookingId = req.params.id;
                const filter = { _id: new ObjectId(bookingId) };
                const updateDoc = {
                    $set: { approved: true },
                };

                const result = await customerCollection.updateOne(filter, updateDoc);

                if (result.matchedCount === 0) {
                    return res.status(404).send({ message: "Booking not found" });
                }

                res.send({ message: "Booking approved successfully", result });
            } catch (error) {
                console.error(error);
                res.status(500).send({ message: "Server error", error: error.message });
            }
        });


        /* Customer related APIs end */



        /* Review APIs start */
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })


        app.get('/reviews', async (req, res) => {
            res.send(await reviewCollection.find().toArray())
        })

        /* Review APIs end */


        /* Users APIs start */
        app.put('/users', async (req, res) => {
            const user = req.body;
            const query = { userEmail: user?.userEmail };
            const result = await userCollection.findOne(query);
            if (!result) {
                return res.send(await userCollection.insertOne(user))
            }
            const updateResult = await userCollection.updateOne(query, { $set: user });
            res.send(updateResult)
        })


        app.get('/users/:email', async (req, res) => {
            const { email } = req.params;
            const result = await userCollection.findOne({ userEmail: email });
            if (!result) {
                return res.send({})
            }
            res.send(result)
        })

        /* Users APIs end */


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}

app.get('/', (req, res) => {
    res.send('Welcome to Happiness Hill')
})

app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`)
})

run().catch(console.dir);
