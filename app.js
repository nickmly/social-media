////////////////////////////////
// REQUIREMENTS
////////////////////////////////

var express = require('express'),
    app = express(),
    expressSession = require('express-session'),
    flash = require('connect-flash-plus'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser')
    passport = require('passport'),
    LocalStrategy = require('passport-local');

////////////////////////////////
////////////////////////////////
// Connect to mongoDB
mongoose.connect("mongodb://localhost/social-media");
// Use body parser
app.use(bodyParser.urlencoded({extended: true}));
// Use public directory 
app.use(express.static(__dirname + "/public"));
// So we don't have to type in .ejs for every res.render call
app.set("view engine", "ejs");
// For flash messages
app.use(flash());

////////////////////////////////
// MODELS
////////////////////////////////
var Post = require('./models/post.js');
var User = require('./models/user.js');
var Comment = require('./models/comment.js');
////////////////////////////////
////////////////////////////////

////////////////////////////////
// PASSPORT CONFIG
////////////////////////////////
app.use(expressSession({
    secret: "secretmsgforsocialmedia",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
////////////////////////////////
////////////////////////////////

////////////////////////////////
// ROUTES
////////////////////////////////

// Place all this data into every route
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

var postRoutes = require('./routes/posts.js');
var authRoutes = require('./routes/index.js');
var commentRoutes = require('./routes/comments.js');
var userRoutes = require('./routes/users.js');

app.use(authRoutes);
app.use(postRoutes);
app.use(commentRoutes);
app.use(userRoutes);

// SEED DB
// Post.remove({}, function(err){
//     console.log("emptied posts db");
// });
// Comment.remove({}, function(err){
//     console.log("emptied comments db");
// });

app.get("*", function(req,res){
    req.flash("error", "Page not found");
    res.redirect("/");
});



////////////////////////////////
////////////////////////////////

// Listen on port 3000 or process port
app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("Server has started");
});
