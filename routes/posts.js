var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');

var middleware = require('../middleware');
var isLoggedIn = middleware.isLoggedIn;

// SHOW POST
router.get("/post/:post_id", function(req,res){
    Post.findById(req.params.post_id).populate("comments").exec(function(err,post){ // Find post using it's ID
        if(err)
            return console.log(err);
        res.render("post/show", {post: post}); // Send that post into the show page and render it
    });    
});

// CREATE POST
router.post("/post", isLoggedIn, function(req,res){
    var title = req.body.title;
    var link = convertGifvToVideo(req.body.link); // Converts to video file if it's a gifv
    var content = req.body.content;

    var linkType = getLinkType(link);

    if(linkType == "Youtube")
        link = convertYoutubeLink(link);

        // Create post and add it to the database
    Post.create({
        title: title,
        link: link,
        content: content,
        linkType: linkType,
        likes: 0,
        dislikes: 0      
    }, function(err, post){
        if(err)
            return console.log(err);
        post.author.id = req.user._id;
        post.author.username = req.user.username;
        post.save();

        req.user.posts.push(post);
        req.user.save();

        res.redirect("/"); // Redirect to index page
    });    
})

// LIKED A POST
router.get("/post/:post_id/like", function(req,res){
    console.log(req.query);
    Post.findById(req.params.post_id, function(err,post){
        if(err) {
            console.log("Failed to like post: " + err);
        }
        post.likes += 1;    
        post.save();
        res.send(String(post.likes));
        
    });
});

// UNLIKE A POST
router.get("/post/:post_id/unlike", function(req,res){
    Post.findById(req.params.post_id, function(err,post){
        if(err) {
            console.log("Failed to like post: " + err);
        }
        post.likes -= 1;    
        post.save();
        res.send(String(post.likes));
        
    });
});

// DISLIKE A POST
router.get("/post/:post_id/dislike", function(req,res){
    Post.findById(req.params.post_id, function(err,post){
        if(err) {
            console.log("Failed to dislike post: " + err);
        }
        post.dislikes += 1;    
        post.save();
        res.send(String(post.dislikes));
        
    });
});

// UNDISLIKE A POST
router.get("/post/:post_id/undislike", function(req,res){
    Post.findById(req.params.post_id, function(err,post){
        if(err) {
            console.log("Failed to dislike post: " + err);
        }
        post.dislikes -= 1;    
        post.save();
        res.send(String(post.dislikes));
        
    });
});

function doesUserLikePost(user, id){
    user.likedPosts.forEach(function(post){
        if(post._id.equals(id)) {
            console.log("Found post");
            return true;
        }
    });

    console.log("Didn't find post");
    return false;
}

function doesUserDislikePost(user, id){
    user.dislikedPosts.find({_id: id }, function(err, foundPost){
        if(err) {
            console.log("Didn't find post");
            return false;          
        } else {
            console.log("Found post");
            return true;
        }        
    });
    return false;
}

// Gets the type of link for a url
function getLinkType(url){
    if(url == null)
        return "Text";

    if(checkIfImage(url))
        return "Image";
    else if(checkIfVideo(url))
        return "Video";
    else if(checkIfYoutube(url))
        return "Youtube";
    
    return "default";
}

// Check if url ends with an image filetype
function checkIfImage(url){
    if(url == null)
        return false;
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

// Convert gifv links to mp4
function convertGifvToVideo(url){
    if(url == null)
        return null;

    if(url.match(/\.(gifv)$/) != null) {
        url = url.slice(0, url.length - 5);
        url = url.concat(".mp4"); 
    }
    return url;
}

// Check if url ends with an video filetype
function checkIfVideo(url) {
    if(url == null)
        return false;    
    return (url.match(/\.(webm|mp4)$/) != null);
}

// Check if url is from youtube
function checkIfYoutube(url) {
    if(url == null)
        return false;
    return (url.match(/(?:(?:https?:\/\/)(?:www)?\.?(?:youtu\.?be)(?:\.com)?\/(?:.*[=/])*)([^= &?/\r\n]{8,11})/g) != null);
}

// Convert youtube link to an embed link
function convertYoutubeLink(url) {
    var videoID = url.split("v=")[1]; // Get ID and variables
    if(videoID == null)
        videoID = url.split("e/")[1]; // If there is no v= in the link, just separate with a slash

    var endPoint = videoID.indexOf("&"); // Find start of variables (time to start video, end video, etc.)
    if(endPoint != -1) { // If there are any vars
        videoID = videoID.substring(0, endPoint); // Get 12 digit video ID and leave out vars
    }
    url = "https://www.youtube.com/embed/" + videoID;// Youtube by default has links that do not work in an iframe, we have to convert them using /embed/
    return url;
}

module.exports = router;