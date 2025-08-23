require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port=process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;

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
    // collection

    const userCollection= client.db("collegeAdmission").collection("user");

    // user save in database
    app.post('/user/:email',async(req,res)=>{
      const user=req.body;
      const email=req.params.email;
      console.log('user',user)
      const query={email}
      const filter=await userCollection.findOne(query);
      if(filter){
        return res.send(filter)
      }
      const result=await userCollection.insertOne(
        {
          ...user
        }
      )
      console.log('result',result)
      res.send(result)

    })
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
// Get all tasks

  
  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('server is running on trippo')
})


app.listen(port,()=>{
    console.log(`port is running on ${port}`)
})