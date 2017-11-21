var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var User = require('../models/user.js');

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
    Post.findById(req.params.post_id, function(err,post){
        if(err) {
            console.log("Failed to like post: " + err);
        }

        User.findById(req.query.user_id, function(err, user){
            if(err){
                console.log("Failed to find user: " + err);
            } else {
                if(!doesUserLikePost(user, post._id)) { // user doesn't like post
                    post.likes += 1;
                    post.save();
                    user.likedPosts.push(post);
                    user.save();
                    res.send(String(post.likes));
                } else { // user does like post, so unlike it
                    post.likes -= 1;    
                    post.save();
                    var postToRemove = user.likedPosts.indexOf(post);
                    user.likedPosts.splice(postToRemove, 1);
                    user.save();
                    res.send(String(post.likes));
                }              
            }           
        }); 
    });
});

// DISLIKE A POST
router.get("/post/:post_id/dislike", function(req,res){
    Post.findById(req.params.post_id, function(err,post){
        if(err) {
            console.log("Failed to dislike post: " + err);
        }

        User.findById(req.query.user_id, function(err, user){
            if(err){
                console.log("Failed to find user: " + err);
            } else {
                if(!doesUserDislikePost(user, post._id)) { // user doesn't dislike post
                    post.dislikes += 1;
                    post.save();
                    user.dislikedPosts.push(post);
                    user.save();
                    res.send(String(post.dislikes));
                } else { // user does dislike post, so undislike it
                    post.dislikes -= 1;    
                    post.save();
                    var postToRemove = user.dislikedPosts.indexOf(post);
                    user.dislikedPosts.splice(postToRemove, 1);
                    user.save();
                    res.send(String(post.dislikes));
                }              
            }           
        }); 
        
    });
});



function doesUserLikePost(user, id){
    var result = false;
    user.likedPosts.forEach(function(post){
        if(post._id.equals(id)) { // Compare the id of the post to see if we have liked it before
            result = true;
            return false; // break out of this function
        }
    });

    return result;
}

function doesUserDislikePost(user, id){
    var result = false;
    user.dislikedPosts.forEach(function(post){
        if(post._id.equals(id)) { // Compare the id of the post to see if we have disliked it before
            result = true;
            return false; // break out of this function
        }
    });

    return result;
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