var util = require('util');
var mongoose = require('../libs/mongoose'), Schema = mongoose.Schema;

var schema = new Schema({
    body:{
        type: String,
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.statics.create = function(comment, user, post, callback){
    var Comment = this;
    var newComment = new Comment({body: comment.body,
        post: post,
        creator: user
    });
    console.log(newComment);
    newComment.save(function(err, comment){
        if(err){
            callback({message: err.message}, null);
        } else {
            callback(null, comment);
        }
    })
};

exports.Comment = mongoose.model('Comment', schema);