// require the library
const mongoose = require('mongoose');
const env = require('./environment');
// mongoose.connect(`mongodb://localhost:27017/${env.db}`,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
mongoose.connect('mongodb+srv://manas:manas123@cluster0.j932clv.mongodb.net/codedial?retryWrites=true&w=majority');

// aquire the connection (to check if it is successful)
const db = mongoose.connection;

// error
db.on('error', console.error.bind(console, "Error in connecting to MongoDB"));

// up and running then print the message
db.once('open', function(){
    console.log('Successfully connected to Database');
});

// exporting the database
module.exports = db;
