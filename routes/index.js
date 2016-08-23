var express = require('express');
var User = require('../models/user').User;
var Post = require('../models/post').Post;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/update_profile', function(req, res, next){
  var updatedUser = req.body.user;
  if(req.session.user){
    User.findByIdAndUpdate(req.session.user,updatedUser, function(err, user){
      if(err){
        res.status(500).send({message: 'Unauthorized'});
      } else {
        res.json({error: null, user: user});
      }
    });
  } else {
    res.status(401).send({error: {message: 'Unauthorized'}});
  }
});

router.post('/sign_up', function(req, res, next){
  var user = req.body.user;

  if(user.password == user.password_confirmation){
    User.register(user, function(err, user){
      if(err){
        res.status(409).send({error: err, user:user});
      } else {
        res.json({error: err, user: user});
      }

    });
  } else {
    res.json({error: 'Passwords do not match!'});
  }
});

router.post('/sign_in', function(req, res, next){
  var user = req.body.user;

  User.authorize(user, function(err, user){
    if(err){
      res.status(401).send({error: err, user: null})
    } else {
      req.session.user = user._id;

      res.json({err: err, user: user});
    }
  });
});

router.get('/sign_out', function(req, res, next){
  req.session.destroy();
  res.json({});
});

router.get('/check_auth', function (req, res, next) {
  if(req.session.user){
    User.findById(req.session.user, function(err, user) {
      if (!user) {
        res.status(403).send({error: 'Unauthorized', user: null});
      } else {
        res.json({error: err, user: user});
      }
    });
  } else {
    console.log(req.session.user);
    res.status(401).send({error: 'Unauthorized(no session)', user: null});
  }
});
// Get all posts
router.get('/posts', function(req, res, next){
  if(req.session.user){
    Post.find({}, function(err, posts){
      if(err){
        res.status(404).send({error: {message: 'No posts'}});
      } else {
        res.json({posts: posts});
      }
    });
  } else {
    res.status(401).send({error: {message: 'Unauthorized'}});
  }
});

//Create new post
router.post('/posts', function(req, res, next){
  var post = req.body.post;

  if(req.session.user){

    Post.create(post, function(error, post){
      if(error){
        console.log(error.message)
        res.status(500).send({error: error})
      } else {
        res.json({error: null, post: post});
      }
    });
  } else {
    res.status(401).send({error:{message: 'Unauthorized'}});
  }

});

//get post by id
router.get('/posts/:id', function(req, res, next){
  if(req.session.user){
    Post.findById(req.params.id, function(err, post){
      if(err){
        res.status(404).send({error:{message: 'Not found'}})
      } else {
        res.json({post: post});
      }
    });
  } else {
    res.status(401).send({error:{message:'Unauthorized'}});
  }
});

//Edit post
router.put('/posts/:id', function(req, res, next){
  if(req.session.user) {
    var post_id = req.params.id;
    var updatedPost = req.body.post;
    Post.findByIdAndUpdate(post_id, updatedPost, function (err, post) {
      if (err) {
        res.status(500).send({error: {message: 'Updated failed'}});
      } else {
        res.json({message: 'Successful update', post: post});
      }
    });
  } else {
    res.status(401).send({message: 'Unauthorized'})
  }
});

router.delete('/posts/:id', function(req, res, next){

  if(req.session.user){
    var post_id = req.params.id;
    Post.findByIdAndRemove(post_id, function(err){
      if(err){
        res.status(500);
      } else {
        res.json({message: 'Successful Deleted'});
      }
    });
  } else {
    res.status(401).send({message: 'Unauthorized'})
  }
});

module.exports = router;
