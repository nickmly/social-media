var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');

router.get("/post/:post_id", function(req,res){
    Post.findById(req.params.post_id, function(err,post){ // Find post using it's ID
        if(err)
            return console.log(err);
        res.render("post/show",{post: post}); // Send that post into the show page and render it
    });
    
});

router.post("/post", function(req,res){
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
        linkType: linkType        
    }, function(err, post){
        if(err)
            return console.log(err);
        res.redirect("/"); // Redirect to index page
    });
    
})

// Gets the type of link for a url
function getLinkType(url){
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
    url = url.replace("watch?v=", "embed/"); // Youtube by default has links that do not work in an iframe, we have to convert them using /embed/
    return url;
}

module.exports = router;