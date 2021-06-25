
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5055;


app.use(cors());
app.use(bodyParser.json());


console.log(process.env.DB_USER)

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.papr4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error',err)
  const serviceCollection = client.db("smartClass").collection("services");
  // perform actions on the collection object
  const orderCollection = client.db("smartClass").collection("order");
  const reviewCollection = client.db("smartClass").collection("reviews");

  console.log('database connected successfully ');


  app.get('/services',(req, res)=>{
      serviceCollection.find()
      .toArray((err,items) => {
          res.send(items)
          
      })
  })
  app.get('/reviews',(req, res)=>{
    reviewCollection.find()
    .toArray((err,items) => {
        res.send(items)
        
    })
})

  app.get('/service/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    serviceCollection.find({ _id: id })
      .toArray((err, items) => {
        res.send(items[0]);
      })
  })





  app.post('/addService',(req, res) => {
      const newService = req.body;
      console.log('adding new service',newService);
      serviceCollection.insertOne(newService)
      .then(result => {
          console.log('inserted count',result.insertedCount);
          res.send(result.insertedCount>0);
      })
  })


  app.post('/addReview',(req, res) => {
    const newService = req.body;
    console.log('adding new service',newService);
    reviewCollection.insertOne(newService)
    .then(result => {
        console.log('inserted count',result.insertedCount);
        res.send(result.insertedCount>0);
    })
})



  app.post('/addOrder', (req, res) => {
    const order = req.body;

    orderCollection.insertOne(order)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  
});


app.listen(process.env.PORT || port)
 