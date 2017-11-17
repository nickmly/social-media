var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

// SHOW USER
router.get("/user/:user_id", function(req,res){
    User.findById(req.params.user_id).populate("posts").exec(function(err, user){
        if(err)
            return console.log(err);
        res.render("user/show", {user: user});
    });
});

module.exports = router;