var util = require('util');
var mongoose = require('../libs/mongoose'), Schema = mongoose.Schema;

var schema = new Schema({
    vote:{
        type: Number,
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.statics.votePost = function(post, vote, voter , callback){
    var Vote = this;
    Vote.find({voter: voter, post: post}).populate('voter').populate('post').exec(function (err, votes) {
        if(err){
            callback(err, null);
        } else {
            if(votes.length){
                callback({message: 'Vote exists'}, votes);
            } else {
                var newVote = new Vote({voter: voter, post: post, vote: vote});
                newVote.save(function(err){
                    callback(err, newVote);
                });
            }
        }
    })
};

schema.statics.postVotes = function(post, callback){
    var Vote = this;
    Vote.find({post: post}).populate('post').populate('voter').exec(function(err, votes){
       if(err){
           callback(err, null);
       } else {
           callback(null, votes);
       }
    });
};

schema.statics.userVotes = function(user, callback){
  var Vote = this;
  Vote.find({voter: user}).populate('voter').populate('post').exec(function(err, votes){
      if(err){
          callback(err, null);
      } else {
          callback(null, votes);
      }
  });
};

exports.Vote = mongoose.model('Vote', schema);