const mongoose = require('mongoose');
const env = require('./environment');

// Create the connection string.
const connectionString = `mongodb+srv://manas:manas123@cluster0.hha0ca6.mongodb.net/${env.db}?retryWrites=true&w=majority`;

// Connect to the MongoDB Atlas cluster using a promise.
const promise = mongoose.connect(connectionString, {useNewUrlParser: true});

// Resolve the promise when the connection is established.
promise.then(() => {
  console.log("Database Connection established");
});

// Reject the promise if the connection fails.
promise.catch(err => {
  console.error(err);
});

module.exports = promise;
