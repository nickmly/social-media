var middlewareObj = {};
var Post = require('../models/post.js');

// middlewareObj.checkPostOwner = function(req,res,next){
//     Post.findById(req.params.post_id, function(err,post){

//     });
// };

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()) // If user is logged in
        return next(); // Continue with next function

    req.flash("error", "You must be logged in to do that.");
    res.redirect("/login"); // Otherwise redirect to login page
};

module.exports = middlewareObj;