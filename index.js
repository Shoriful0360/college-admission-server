require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port=process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors({
  origin:['https://college-admission-50857.web.app','http://localhost:5174','http://localhost:5173'],
    credentials: true
}));



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

    const userCollection= client.db("collegeAdmission").collection("user");
    const collegeCollection=client.db("collegeAdmission").collection("colleges");
    const collegeNameCollection=client.db("collegeAdmission").collection("college_name");
    const admissionCollection=client.db("collegeAdmission").collection("admission");
    const reviewCollection=client.db("collegeAdmission").collection("review");
    const papersCollection=client.db("collegeAdmission").collection("research_papers");

    // user save in database
    app.post('/user/:email',async(req,res)=>{
      const user=req.body;
      const email=req.params.email;
 
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

      res.send(result)

    })

    // get user from database
    app.get('/user/:email',async(req,res)=>{
      const email=req.params.email;
      const query={email}
      const result=await userCollection.findOne(query)
    
      res.send(result)
    })

    // update user info
    app.put('/users/:email',async(req,res)=>{
      const email=req.params.email;
    
      const updateData=req.body;

   
      const result=await userCollection.updateOne(
        {email},
        {$set:updateData}
        
      )
      res.send(result)
    })

    // get limit college collection
    app.get('/limit_colleges',async(req,res)=>{
      const result=await collegeCollection.find().limit(4).toArray()
      res.send(result)
    })

    // collect total colleges
   app.get('/colleges', async (req, res) => {
  try {
    const search = req.query.search; // query থেকে name নিলাম
    let query = {};

    // যদি search দেওয়া থাকে, তাহলে filter তৈরি করব
    if (search) {
      query = {
        name: { $regex: search, $options: "i" }  // i = case-insensitive
      };
    }

    // যদি search না থাকে, query খালি → সব data fetch হবে
    const result = await collegeCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong" });
  }
});


    // single college from college collection
    app.get('/college/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await collegeCollection.findOne(query)

      res.send(result)
    })


    // get college name
    app.get('/college_name',async(req,res)=>{
      const result=await collegeNameCollection.find().toArray()
      return res.send(result)
    })

    // save admission info
    app.post('/admission',async(req,res)=>{
      const formData=req.body;
      const result=await admissionCollection.insertOne(formData)
      return res.send(result)
    })

    // my admission
    app.get('/my_admission/:email',async(req,res)=>{
      const email=req.params.email;
      const query={email}
      if(email){

        const result=await admissionCollection.find(query).toArray()
        res.send(result)
      }
    
    })

    // review save in database
    app.post('/reviews',async(req,res)=>{
      const formData=req.body;
      const result=await reviewCollection.insertOne(formData)
      return res.send(result)
    })

    // get all review
    app.get('/reviews',async(req,res)=>{
      const result=await reviewCollection.find().toArray()
      res.send(result)
    })

    // papers
    app.get('/papers',async(req,res)=>{
      const result=
    })
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
// Get all tasks

  
  
    // await client.db("admin").command({ ping: 1 });
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