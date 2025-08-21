require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;


// MiddleWare Start
app.use(cors())
app.use(express.json())

// MiddleWare End

const uri = "mongodb+srv://hridoykhan148385:SUByXmuSE9Gft4Kk@happiness-hill.1es2bek.mongodb.net/?retryWrites=true&w=majority&appName=Happiness-Hill";

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


        /* Room related APIs start */
        app.get('/rooms', async (req, res) => {
            const { featuredRooms } = req.query;
            let cursor = roomCollection.find();
            if (featuredRooms === 'featured') {
                cursor = cursor.limit(5)
            }
            const result = await cursor.toArray()
            res.send(result)
        })
        /* Room related APIs end */







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
