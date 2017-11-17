var mongoose = require('mongoose');
var postSchema = new mongoose.Schema({
    title: String,
    link: String,
    content: String,
    isImage: Boolean,
    isVideo: Boolean,
    isYoutube: Boolean
});

module.exports = mongoose.model("Post", postSchema);