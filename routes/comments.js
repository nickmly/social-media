var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var Comment = require('../models/comment.js');


var middleware = require('../middleware');
var isLoggedIn = middleware.isLoggedIn;
var checkCommentOwner = middleware.checkCommentOwner;

// CREATE COMMENT
router.post("/post/:post_id/", isLoggedIn, function(req,res){
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
router.get("/post/:post_id/comment/:comment_id/edit", checkCommentOwner, function(req,res){
    Comment.findById(req.params.comment_id, function(err, comment) {
        if(err)
            return console.log(err);
        Post.findById(req.params.post_id, function(err, post){
            if(err)
                return console.log(err);
            res.render("comment/edit", {comment: comment, post: post});
        });        
    });
    
});

// UPDATE COMMENT
router.put("/post/:post_id/comment/:comment_id/", checkCommentOwner, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err) {
            req.flash("error", "Failed to update comment");
            res.redirect("back");
            return console.log("Failed to update comment");
        }
        req.flash("success", "Updated comment successfully");
        res.redirect("/post/" + req.params.post_id);
    });
});

// DELETE COMMENT
router.delete("/post/:post_id/comment/:comment_id/", checkCommentOwner, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
        if(err) {
            req.flash("error", "Failed to remove comment");
            res.redirect("back");
            return console.log("Failed to remove comment");
        }
        req.flash("success", "Removed comment successfully");
        res.redirect("/post/" + req.params.post_id);
    });
});

module.exports = router;