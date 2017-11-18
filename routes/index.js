var express = require('express');
var passport = require('passport');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var router = express.Router();


router.get("/", function(req,res){
    Post.find({}, function(err,posts){
        if(err)
            return console.log(err);
        res.render("landing", {posts: posts});
    });
});

router.get("/login", function(req,res){
    res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: "Invalid username or password",
    successFlash: "Logged in successfully."
}), function(req,res) {

});

router.get("/register", function(req,res){
    res.render("auth/register");
});

router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Signed up successfully! Welcome " + user.username);
            res.redirect("/");
        });
    });
});

router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged out successfully.");
    res.redirect("/");
});



module.exports = router;