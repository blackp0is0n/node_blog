var express = require('express');
var User = require('../models/user').User;
var Post = require('../models/post').Post;
var Comment = require('../models/comment').Comment;
var Vote = require('../models/vote').Vote;
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
  Post.find({}).populate('creator').exec(function(err, posts){
    if(err){
      res.status(404).send({error: {message: 'No posts'}});
    } else {
      res.json({posts: posts});
    }
  });
});

//Create new post
router.post('/posts', function(req, res, next){
  var post = req.body.post;
  post.creator = req.user;
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
    Post.findById(req.params.id).populate('creator').exec(function(err, post){
      if(err){
        res.status(404).send({error:{message: 'Not found'}})
      } else {
        res.json({post: post});
      }
    });
});

router.post('/posts/:id/new_comment', function(req, res, next){
  if(req.session.user){
    Post.findById(req.params.id, function(err, post){
      if(err){
        res.status(500).send({error:{message: 'Comment cannot be created'}});
      } else {
        var comment = req.body.comment;
        var user = req.user;
        Comment.create(comment, user, post, function(err, comment){
          if(err){
            console.log(err.message);
            res.status(503).send({error:{message:'Comment cannot be created'}});
          } else {
            res.json({post: post, comment:comment});
          }
        });
      }
    });
  } else {
    res.status(401).send({error: {message: 'Unauthorized'}});
  }
});

router.get('/posts/:id/comments', function(req, res, next){
  Post.findById(req.params.id, function(err, post){
    if(err){
      res.status(500).send({error:{message: 'Cannot load comments'}});
    } else {
      Comment.find({post: post}).populate('creator').populate('post').exec(function(err, comments){
        if(err){
          res.status(500).send({error:{message: 'Cannot load comments'}});
        } else {
          res.json({comments: comments});
        }
      });
    }
  });
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


//Delete post
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

//Remove comment
router.delete('/comments/:id', function(req, res, next){
  if(req.session.user){
    Comment.findByIdAndRemove(req.params.id, function(err){
      if(err){
        res.status(500).send({error:{message:'Error while removing comment'}});
      } else {
        res.json({message: 'Successful removed'});
      }
    });
  } else {
    res.status(401).send({error:{message:'Unauthorized'}});
  }
});

//Get User posts
router.get('/users/:id/posts', function(req, res, next){
  User.findById(req.params.id, function(err, user){
    if(err){
      res.status(500).send({error:{message: err.message}});
    } else {
      Post.find({creator: user}, function(err, posts){
        if(err){
          res.status(500).send({error: {message: err.message}})
        } else {
          res.json({posts: posts, user: user});
        }
      });
    }
  });
});

router.post('/search', function(req, res, next){
  var criteria = req.body.criteria;
  var q = req.body.query;
  if(q){
    var opts = {};
    opts[criteria] = RegExp(q, "i");
    if(criteria=='username'){
      User.findOne(opts, function(err, user){
        if(err){
          res.status(500).send({error:{message: 'Error while finding user'}});
        } else {
          if(user){
            Post.find({creator: user}).populate('creator').exec(function(err, posts){
              if(err){
                res.status(500).send({error:{message: 'Error while finding posts'}});
              } else {
                res.json({posts: posts});
              }
            });
          } else {
            res.status(404).send({error:{message:'User not found'}});
          }
        }
      });
    } else {
      Post.find(opts).populate('creator').exec(function(err, posts){
        if(err){
          res.status(500).send({error:{message: err.message}});
        } else {
          res.json({posts: posts});
        }
      });
    }
  } else {
    res.json({posts:[]});
  }
});
//Get post votes
router.get('/posts/:id/votes', function(req, res, next){
  Post.findById(req.params.id, function (err, post) {
    if(err){
      res.status(500).send({error: err});
    } else {
      Vote.postVotes(post, function(err, votes){
        if(err){
          res.status(500).send({error: err});
        } else {
          res.json({votes: votes});
        }
      });
    }

  });
});

router.post('/post/:id/vote', function(req, res, next){
  var vote = req.body.vote;
  if(req.session.user){
    Post.findById(req.params.id, function (err, post) {
      if(err){
        res.status(500).send({error:err});
      } else {
        Vote.votePost(post, vote, req.user, function(err, vote){
          if(err){
            res.status(500).send({error: err});
          } else {
            res.json({vote: vote});
          }
        })
      }
    });
  } else {
    res.status(401).send({error:{message: 'Unauthorized users cannot vote'}});
  }
});

module.exports = router;
