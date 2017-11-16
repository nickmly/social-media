var mongoose = require('mongoose');
var postSchema = new mongoose.Schema({
    title: String,
    link: String
});

module.exports = mongoose.model("Post", postSchema);