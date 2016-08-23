var express = require('express');
var User = require('../models/user').User;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
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

router.get('/posts', function(req, res, next){

});

router.post('/posts', function(req, res, next){

});

router.get('/posts/:id', function(req, res, next){

});

router.post('/posts/:id/edit', function(req, res, next){

});

router.delete('/posts/:id/delete', function(req, res, next){

});

module.exports = router;
