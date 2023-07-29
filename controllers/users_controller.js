const User = require('../models/user');
const Reset = require('../models/reset_password');
const fs = require('fs');
const path = require('path');
const passwordMailer = require('../mailers/password_reset_mailer');

// let's keep it same as before
module.exports.profile = async function(req, res){
    try{
        let user = await User.findById(req.params.id);
            return res.render('user_profile', {
                title: 'User Profile',
                profile_user: user
            });
    }catch(err){
        console.log("error in profile controller",err);
    }

}


module.exports.update = async function(req, res){
   

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file){

                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = async function(req, res){
    try{
        if (req.body.password != req.body.confirm_password){
            req.flash('error', 'Passwords do not match');
            return res.redirect('back');
        }
    
        let user = await User.findOne({email: req.body.email});
            if (!user){
                user = await User.create(req.body);
                return res.redirect('/users/sign-in');
            }else{
                req.flash('success', 'You have signed up, login to continue!');
                return res.redirect('/users/sign-in');
            }
    }catch(err){
        console.log("Error in creating user",err);
        return;
    }
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout(req.user, err => {
        if(err) return ;
        res.redirect("/");
      });
    req.flash('success', 'You have logged out!');


    return res.redirect('/');
}

module.exports.forgotpassword = function(req,res){
    return res.render('forget_password',{
        title: "Codeial | Forgot Password"
    });
}

module.exports.forgotemail = async function(req, res){
    try{
        let user = await User.findOne({email:req.body.email});
        if(user){
            let updatetoken = await Reset.findOne({email: req.body.email});
            let randomNum = Math.round(Math.random()*10000000);
            let mail = user.email;
            // if(updatetoken){
            //     updatetoken.accessToken = randomNum;
            //     updatetoken.expireIn = new Date().getTime() * 200 *1000;
            //     passwordMailer.newPasswordLink({mail,randomNum});
            //     req.flash('success', 'Link sent to email');
            //     return res.redirect('/');
            // }else{
                Reset.create({
                    email: req.body.email,
                    accessToken: randomNum,
                    expireIn: new Date().getTime() * 200 *1000
                }, function(err, user){
                    if(err){req.flash('error', err); return}
                    passwordMailer.newPasswordLink({mail,randomNum});
                    req.flash('success', 'Link sent to email');
    
                    return res.redirect('/');
                })
            // }
        }else{
            req.flash('error', 'Email id not found');
            return res.redirect('/');
        }

    }catch(err){
        console.log(err);
    }
}

module.exports.updatepassword = async function(req,res){
    try{

        let granted = await Reset.findOne({email:req.body.email});
        if(granted){
            if(req.body.password != req.body.confirm_password){
                req.flash('error', 'Passwords do not match');
                return res.redirect('/');
            }
            User.findOneAndUpdate({email: req.body.email},
                {password:req.body.password}, function(err,user){
                    if(err) console.log(err);
                    req.flash('success', 'Password changed successfully');
                    granted.remove();
                    return res.redirect('/');
                });
        }else{
            req.flash('error', 'Not have permission');
            return res.redirect('/');
        }
    }catch(err){
        console.log(err);
    }
}


module.exports.passpage = async function(req, res){
    try{
        let user = await User.findOne({email:req.query.email});
        if(user){
            let passcheck = await Reset.findOne({email:req.query.email});
            if(passcheck){
                if(passcheck.accessToken == req.query.token){
                    if(passcheck.expireIn - new Date().getTime() < 0){
                        req.flash('error', 'Token expired');
                        passcheck.remove();
                        res.redirect('/');
                    }else{
                        return res.render('createpassword',{
                            title: 'Create Password',
                            email: req.query.email
                        })
                    }
                }else{
                    req.flash('error', 'Invalid token');
                    res.redirect('/');
                }
            }
        }else{
            req.flash('error', 'Email id not found');
            return res.redirect('/');
        }

    }catch(err){
        console.log(err);
    }
}