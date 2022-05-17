const express= require('express');
const router = express.Router();

const usersController = require('../controllers/users_controller');

router.get('/', function(req,res){
    return res.render('home', {
        title:"Users"
    })
})

router.get('/profile', usersController.profile);


module.exports = router;