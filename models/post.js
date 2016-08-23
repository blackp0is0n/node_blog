var util = require('util');
var mongoose = require('../libs/mongoose'), Schema = mongoose.Schema;

var schema = new Schema({
    title:{
        type: String,
        unique: true,
        required: true
    },
    content:{
        type: String,
        unique: true,
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

export.Post = mongoose.model('Post', Schema);