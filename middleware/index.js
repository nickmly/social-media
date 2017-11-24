var middlewareObj = {};
var Post = require('../models/post.js');
var Comment = require('../models/comment.js');

middlewareObj.checkCommentOwner = function(req,res,next){
    if(!req.isAuthenticated()) {// If user is not logged in
        req.flash("error", "You must be logged in to do that.");
        return res.redirect("/login"); 
    } 
        
    Comment.findById(req.params.comment_id, function(err,comment){
        if(err){
            return console.log("Failed to find comment");
        }
        if(comment.author.id.equals(req.user._id)){
            next();
        } else {
            req.flash("error", "You do not have permission to do that");
            res.redirect("back"); 
        }
    });
};

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()) // If user is logged in
        return next(); // Continue with next function

    req.flash("error", "You must be logged in to do that.");
    res.redirect("/login"); // Otherwise redirect to login page
};

module.exports = middlewareObj;