var crypto = require('crypto');
var util = require('util');
var async = require('async');
var mongoose = require('../libs/mongoose'), Schema = mongoose.Schema;

var schema = new Schema({
    username:{
        type: String,
        unique: true,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function(password){
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password){
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function(){ return this._plainPassword; });

schema.methods.checkPassword = function(password){
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.register = function(user,callback){
    var User = this;
    User.findOne({username: user.username}, function(err, foundedUser){
        if(err){
            callback(err, foundedUser);
        } else {
            if(foundedUser){
                callback({message: 'User exists'}, foundedUser);
            } else {
                var usr = new User(user);
                usr.save(function(err){
                    if(err){
                        callback({message: 'Error while saving user. Please, check credentials'}, null);
                    } else {
                        callback(null, usr);
                    }
                })
            }


        }
    });
};

schema.statics.authorize = function(user, callback){
    var User = this;
    var email = user.email;
    var password = user.password;
    async.waterfall([
        function(callback){
            User.findOne({email: email}, callback);
        },
        function(user, callback){
            if(user){
                if(user.checkPassword(password)){
                    callback(null, user);
                } else {
                    callback({message: 'Error! Please, check credentials ang try again'}, null);
                }
            } else {
                callback({message: 'Error! Please, check credentials ang try again'}, null);
            }
        }

    ], callback);
};

exports.User = mongoose.model('User', schema);