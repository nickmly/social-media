var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});
// Add passport methods to user schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);