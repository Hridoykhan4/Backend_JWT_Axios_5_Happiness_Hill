require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;



/* Options Start */
const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200
}



/* Options End */




// MiddleWare Start
app.use(cors(corsOptions))
app.use(express.json())

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


        /* Room related APIs start */
        app.get('/rooms', async (req, res) => {
            const { featuredRooms } = req.query;
            let cursor = roomCollection.find()
            if (featuredRooms === 'featured') {
                cursor = cursor.sort({ "price": -1 }).limit(5)
            }
            const result = await cursor.toArray()
            res.send(result)
        })

        // Get a single room
        app.get('/rooms/:id', async (req, res) => {
            const id = req.params.id;
            const result = await roomCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        })

        // Get all post by the owner
        app.get('/my-posted-rooms/:email', async (req, res) => {
            const email = req.params.email;
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

        app.get('/my-bookings/:email', async (req, res) => {
            res.send(await customerCollection.find({ 'customerInfo.email': req.params.email }).toArray())
        })


        app.get('/dashboard-bookings', async (req, res) => {
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
        app.put('/users/:email', async (req, res) => {
            const user = req.body;
            const email = req.params.email;
            const query = { userEmail: email };
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
