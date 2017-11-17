var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');

router.get("/post/:post_id", function(req,res){
    Post.findById(req.params.post_id, function(err,post){
        if(err)
            return console.log(err);
        res.render("post/show",{post: post});
    });
    
});

router.post("/post", function(req,res){
    var title = req.body.title;
    var link = convertGifvToVideo(req.body.link); // Converts to video file if it's a gifv
    var content = req.body.content;
    var isImage = checkIfImage(link);
    var isVideo = checkIfVideo(link);
    var isYoutube = checkIfYoutube(link);

    if(isYoutube)
        link = convertYoutubeLink(link);

    Post.create({
        title: title,
        link: link,
        content: content,
        isImage: isImage,
        isVideo: isVideo,
        isYoutube: isYoutube
    }, function(err, post){
        if(err)
            return console.log(err);
        res.redirect("/");
    });
    
})

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

function checkIfVideo(url) {
    if(url == null)
        return false;    
    return (url.match(/\.(webm|mp4)$/) != null);
}

function checkIfYoutube(url) {
    if(url == null)
        return false;
    return (url.match(/(?:(?:https?:\/\/)(?:www)?\.?(?:youtu\.?be)(?:\.com)?\/(?:.*[=/])*)([^= &?/\r\n]{8,11})/g) != null);
}

// Convert youtube link to an embed link
function convertYoutubeLink(url) {

    url = url.replace("watch?v=", "embed/");
    return url;
}

module.exports = router;