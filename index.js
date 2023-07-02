const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('server is runing')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mi7otul.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();
        const projectCollection = client.db('myPortfolio').collection('recentProject')
        const feedbackCollection = client.db('myPortfolio').collection('feedback')

        app.get('/project', async (req, res) => {
            const recentProject = await projectCollection.find().toArray()
            res.send(recentProject)
        })
        app.get('/feedback', async (req, res) => {
            const feedbackData = await feedbackCollection.find().toArray()
            res.send(feedbackData)
        })



        app.post('/feedback', async (req, res) => {
            const newItem = req.body;
            const result = await feedbackCollection.insertOne(newItem);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})