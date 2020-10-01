const express  = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


const app = express();

//declare as middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const password = 'LvLn0lG2J0rnX4W5';

//database connection
const uri = "mongodb+srv://e-commerceUser:LvLn0lG2J0rnX4W5@cluster0.mbwlu.mongodb.net/e-commercedb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("e-commercedb").collection("products");
  
  // show all data
  app.get('/products', (req, res) => {
    collection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
  
  // add data
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    collection.insertOne(product)
    .then(result => {
      console.log("data added successfully");
      res.redirect('/');
    })
  })

  // read single data
  app.get('/product/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents[0]); 
    })
  })

  // update data
  app.patch('/update/:id', (req, res) => {
    collection.updateOne({_id: ObjectId(req.params.id)}, 
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
    })
  })

  // delete data
  app.delete('/delete/:id', (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) => {
      res.send(result.deletedCount > 0);
    })
  })


});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  })



app.listen(3001);