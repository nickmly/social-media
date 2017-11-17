var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var Comment = require('../models/comment.js');

// CREATE COMMENT
router.post("/post/:post_id/", function(req,res){
    Post.findById(req.params.post_id, function(err,post){ // Find associated post for this comment
        if(err)
            return console.log(err);
        Comment.create(req.body.comment, function(err, comment){
            if(err)
                return console.log(err);
            
            // Add user data to comment and save it
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;            
            comment.save();

            post.comments.push(comment);
            post.save();

            // Go back to post show page
            res.redirect("/post/"+ post._id);
        });
    });
});

module.exports = router;