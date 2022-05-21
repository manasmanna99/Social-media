const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = function(req,res){
    Post.create({
        content: req.body.content,
        user: req.user.id
    }, function(err, post){
        if(err){
            console.log('Error in creating post');
            return;
        }
        return res.redirect('back');
    })
}

module.exports.destroy = function(req , res){
    Post.findById(req.params.id, function(err, post){
        //converting the object id into string thats why id in place of _id
        if(post.user == req.user.id){
            post.remove();
            Comment.deleteMany({post: req.params.id}, function(err){
                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
        
    })
}