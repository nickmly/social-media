////////////////////////////////
// REQUIREMENTS
////////////////////////////////

var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser')
    passport = require('passport'),
    LocalStrategy = require('passport-local');

////////////////////////////////
////////////////////////////////

mongoose.connect("mongodb://localhost/social-media");
// Use body parser
app.use(bodyParser.urlencoded({extended: true}));
// Use public directory 
app.use(express.static(__dirname + "/public"));
// So we don't have to type in .ejs for every res.render call
app.set("view engine", "ejs");

////////////////////////////////
// MODELS
////////////////////////////////
var Post = require('./models/post.js');
////////////////////////////////
////////////////////////////////

////////////////////////////////
// ROUTES
////////////////////////////////
var postRoutes = require('./routes/posts.js');
app.use(postRoutes);

// SEED DB
Post.remove({}, function(err){
    console.log("emptied posts db");
});
//

app.get("/", function(req,res){
    Post.find({}, function(err,posts){
        if(err)
            return console.log(err);
        res.render("landing", {posts: posts});
    });
});



////////////////////////////////
////////////////////////////////

// Listen on port 3000
app.listen(3000, process.env.IP, function(){
    console.log("Server has started");
});
