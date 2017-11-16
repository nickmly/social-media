var express = require('express');
var router = express.Router();

router.get("/post/new", function(req,res){
    res.render("post/new");
});

router.post("/post", function(req,res){
    console.log(req.body);
    res.send("Created new post");
})

module.exports = router;