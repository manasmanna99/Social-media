const Post = require('../models/post');
const User = require('../models/user');



module.exports.home = async function(req, res){

    try{
         // populate the user of each post and likes also
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path:  'likes'
            }
        }).populate('likes');
        posts.forEach((post)=>{
            post.comments.forEach(async (comment)=>{
                comment.user = await User.findById(comment.user)
            })
        })
        let users = await User.find({});

        return res.render('home', {
            title: "ManChat | Home",
            posts:  posts,
            all_users: users
        });

    }catch(err){
        console.log('Error', err);
        return;
    }
   
}

