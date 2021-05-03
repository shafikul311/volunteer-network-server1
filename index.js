const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectID = require("mongodb").ObjectID;
const port = process.env.PORT || 5080

require("dotenv").config();

app.use(cors());
app.use(express.json());


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${ process.env.DB_PASS}@cluster0.eq0p0.mongodb.net/${ process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db(`${process.env.DB_Name}`).collection("event");
  const volunteerCollection = client.db(`${process.env.DB_Name}`).collection("volunteer");


// get Event
  app.get("/event", (req ,res)=>{
    eventCollection.find({}).toArray((err ,documents)=>{
      res.send(documents)
    })
  });

// get single Event by ID
  app.get("/event/:id", (req ,res)=>{
    const id =ObjectID(req.params.id);
    eventCollection.find({_id:id}).toArray((err, event)=>{
      res.send(event)
    });
  });


  // add Event
  app.post('/addEvents' , (req ,res)=>{
    const events = req.body
    eventCollection.insertOne(events).then((event) =>{
      console.log(events)
      res.send(event.insertCount>0)
    })

  })


   //delete event
   app.delete('/deleteEvent/:id',(req,res)=>{
    const id = ObjectID(req.params.id);
    eventCollection.findOneAndDelete({_id:id}).then(result =>{
      console.log(result)
      res.send(result.value)
    })
  })

  // Get Event
  app.get("/getVolunteer", (req ,res)=>{
    volunteerCollection.find({}).toArray((err ,documents)=>{
      res.send(documents)
    })
  });


  // add volunteer
  app.post('/addVolunteer', (req ,res)=>{
    const volunteer = req.body
    volunteerCollection.insertOne(volunteer).then((vol) =>{
      res.send(vol.insertCount>0)
    })

  })

  
  //delete volunteer
  app.delete('/delete/:id',(req,res)=>{
    const id = ObjectID(req.params.id);
    volunteerCollection.findOneAndDelete({_id:id}).then(result =>{
      console.log(result)
      res.send(result.value)
    })
  })



  // client.close();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})