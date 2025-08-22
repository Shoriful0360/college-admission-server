require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port=process.env.PORT || 9000;

const app = express();
app.use(express.json());
app.use(cors());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    const taskCollection= client.db("taskDB").collection("tasks");
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
// Get all tasks
app.get("/tasks", async (req, res) => {
  const email=req.query.email
  const query={email}
    const tasks = await taskCollection.find(query).toArray();
    res.send(tasks);
  });
  
  // 🔹 Add a new task
  app.post("/tasks", async (req, res) => {
    const data= req.body;
    const result = await taskCollection.insertOne(data);
    res.send(result);
  });
  
  // 🔹 Update task (Title or Move to another process)
  app.patch("/tasks/:id", async (req, res) => {
  const id=req.params.id;

  const {status}=req.body;
  const query={_id: new ObjectId(id)}
  const updateDoc={
    $set:{status}
  }
  const result=await taskCollection.updateOne(query,updateDoc)
res.send(result)
  });
  app.patch("/tasks-update/:id", async (req, res) => {
  const id=req.params.id;

  const {status,title,description}=req.body;
  const query={_id: new ObjectId(id)}
  const updateDoc={
    $set:{status,title,description}
  }
  const result=await taskCollection.updateOne(query,updateDoc)
res.send(result)
  });
  
  // 🔹 Delete a task
  app.delete("/tasks/:id", async (req, res) => {
 const id=req.params.id
    const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  });
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