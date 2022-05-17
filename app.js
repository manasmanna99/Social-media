const express= require('express');
const expressLayouts = require('express-ejs-layouts');
const app= express();
const port = 8000;
const db = require('./config/monjoose');
app.use(expressLayouts);
//extract style an script fro sub pages
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.use(express.static('./assets/'));


//use express router
app.use('/', require('./routes'));

//setting up view engine
app.set('view engine', 'ejs');
app.set('views', './views');





app.listen(port, function(err){
    if(err){
        console.log(`Error : ${err}`);
    }

    console.log(`Server is running on port ${port}`);
});