mongoose = require('mongoose');

// connection base de donnees
const MONGO_URL = 'mongodb+srv://medellin:zolazed1234@cluster0.ep8ebmn.mongodb.net/?retryWrites=true&w=majority'
mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the database!')
}).catch(err => {
    console.log("Cannot connect to the database!",err)
});

exports.db_conn = mongoose

// const { MongoClient } = require('mongodb');

// async function mongoose() {
//   // Connection URL
//   const url = 'mongodb://localhost:27017'; // Replace with your MongoDB connection URL

//   // Database Name
//   const dbName = 'countofmoney'; // Replace with your database name

//   // Create a new MongoClient
//   const client = new MongoClient(url, { useUnifiedTopology: true });

//   try {
//     // Connect to the server
//     await client.connect();

//     console.log('Connected to MongoDB');

//     // Specify the database
//     const db = client.db(dbName);

//     return db;
//   } catch (err) {
//     console.error('Error connecting to MongoDB:', err);
//     throw err; // Rethrow the error for the calling code to handle
//   }
// }

// exports.db_conn = mongoose
