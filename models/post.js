var util = require('util');
var mongoose = require('../libs/mongoose'), Schema = mongoose.Schema;

var schema = new Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
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

schema.statics.create = function(post, callback){
    var Post = this;
    var newPost = new Post(post);
    newPost.save(function(err, post){
        if(err){
            callback({message: err.message}, null);
        } else {
            callback(null, post);
        }
    })
};
exports.Post = mongoose.model('Post', schema);