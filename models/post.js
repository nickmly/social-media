var mongoose = require('mongoose');
var postSchema = new mongoose.Schema({
    title: String,
    link: String,
    content: String,
    isImage: Boolean,
    isVideo: Boolean
});

module.exports = mongoose.model("Post", postSchema);