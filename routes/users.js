const express= require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users_controller');

router.get('/', function(req,res){
    return res.render('home', {
        title:"Users"
    })
})

router.get('/profile', passport.checkAuthentication, usersController.profile);

router.get('/signup', usersController.signUp);

router.get('/signin', usersController.signIn);

router.post('/create', usersController.createUser);

router.post('/createsession', passport.authenticate(
    'local',
    { failureRedirect: '/users/signin' }
    ), usersController.createSession);

router.get('/signout', usersController.destroySession);

module.exports = router;