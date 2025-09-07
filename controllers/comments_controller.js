const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const Like = require('../models/like');
const User = require('../models/user')

module.exports.create = async function (req, res) {

    try {
        let post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();

            comment = await comment.populate(['user', 'post']);
            comment.post.user = await User.findById(comment.post.user);
            let job = queue.create('emails', comment).save(err => {
                if (err) {
                    console.log('Error in creating a queue job', err);
                    return;
                }
                console.log('Job enqueued with ID', job.id);
            });
            // commentsMailer.newComment(comment);
            if (req.xhr) {
                // Similar for comments to fetch the user's id!


                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }


            req.flash('success', 'Comment published!');

            res.redirect('/');
        }
    } catch (err) {
        req.flash('error', err);
        return;
    }

}


module.exports.destroy = async function (req, res) {

    try {
        let comment = await Comment.findById(req.params.id);
        let post = await Post.findById(comment.post);

        if (comment.user == req.user.id || req.user.id == post.user) {
            let postId = comment.post;

            await comment.deleteOne();

            await Post.findByIdAndUpdate(postId, { $pull: { comments: { _id: req.params.id } } });

            //destroy the associated likes for this comment
            await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });

            // send the comment id which was deleted back to the views
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        } else {
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        return;
    }

}
