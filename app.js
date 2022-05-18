const express= require('express');
const cookieParser= require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const app= express();
const port = 8000;
const db = require('./config/monjoose');

//for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');


app.use(express.urlencoded());
app.use(cookieParser())
app.use(expressLayouts);
app.use(express.static('./assets/'));
//use express router
app.use('/', require('./routes'));


//extract style an script fro sub pages
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


//setting up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'codial',
    //todo change the secret key before deployment in the production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());



app.listen(port, function(err){
    if(err){
        console.log(`Error : ${err}`);
    }

    console.log(`Server is running on port ${port}`);
});