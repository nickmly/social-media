var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');



router.get("/post/new", function(req,res){
    res.render("post/new");
});

router.post("/post", function(req,res){
    var title = req.body.title;
    var link = req.body.link;
    var content = req.body.content;
    Post.create({
        title: title,
        link: link,
        content: content
    }, function(err, post){
        if(err)
            return console.log(err);
        res.redirect("/");
    });
    
})

module.exports = router;