app.controller('AuthController', function($state, $scope,$mdDialog, AuthService) {
});

app.controller('UsersController', function($scope, $stateParams, AuthService, PostsService){
    var user_id = $stateParams.id;
    var promise = PostsService.getUserPosts(user_id);
    promise.then(function successCallback(data){
        $scope.posts = data.posts;
        data.posts.forEach(function(post){
            var dateObject = new Date(Date.parse(post.created));
            post.created = dateObject.toDateString();
        });
        var dateObject = new Date(Date.parse(data.user.created));
        data.user.created = dateObject.toDateString();
        $scope.user = data.user;
    }, function errorCallback(error){
        var someAlert = $mdDialog.alert({
            title: 'Error!',
            textContent: error,
            ok: 'OK'
        });
        $mdDialog
            .show(someAlert)
            .finally(function () {
                someAlert = undefined;
            });
    });
});

app.controller('UsersUpdateController', function(AuthService, $state, $mdDialog, $scope ){
	$scope.user = AuthService.currentUser();
    $scope.update = function(user){
        var promise = AuthService.updateCurrentUser(user);
        promise.then(function(data){
            var someAlert = $mdDialog.alert({
                title: 'Success!',
                textContent: 'Successful profile updating',
                ok: 'OK'
            });
            $mdDialog
                .show(someAlert)
                .finally(function () {
                    someAlert = undefined;
                });
            $state.reload()
        }, function(error){
            var someAlert = $mdDialog.alert({
                title: 'Error!',
                textContent: error,
                ok: 'OK'
            });
            $mdDialog
                .show(someAlert)
                .finally(function () {
                    someAlert = undefined;
                });
        });

    }
});

app.controller('PostsController', function($scope,$log, $state, PostsService, $mdDialog, $stateParams, AuthService){
    $scope.showRating = false;
    $scope.comments = [];
    $scope.postRating = 0;
    switch($state.$current.self.name){
        case 'posts.all':
            var promise = PostsService.getAllPosts();
            promise.then(function(data){
                data.forEach(function(post){
                    var dateObject = new Date(Date.parse(post.created));
                    post.created = dateObject.toDateString();
                });
               $scope.posts = data;
               $log.log(data)
            }, function(error){
                $scope.posts = [];
            });
            break;
        case 'posts.show':
            var promise = PostsService.getPost($stateParams.id);
            promise.then(function(data){
                var dateObject = new Date(Date.parse(data.post.created));
                data.post.created = dateObject.toDateString();
                var currentUser = AuthService.currentUser();
                var votesSum = 0;
                data.votes.forEach(function(vote){
                    votesSum += vote.vote;
                    if(currentUser){
                        if(vote.voter._id == currentUser._id){
                            $scope.showRating = true;
                            $scope.rating = vote.vote;
                        }
                    }

                });
                if(votesSum > 0){
                    $scope.postRating = votesSum / data.votes.length;
                }
                $scope.post = data.post;

                var socket = io();
                socket.on('connect', function() {
                    socket.emit('room', $scope.post._id);
                });
                socket.on('comments_count', function(data) {
                    $scope.commentsCount = data;
                    $scope.$apply(function(msg){
                        console.log(msg);
                    });
                });
            }, function(error){
                $scope.post = {};
            });
            var promise = PostsService.getPostComments($stateParams.id);
            promise.then(function(data){
                data.forEach(function(comment){
                    var dateObject = new Date(Date.parse(comment.created));
                    comment.created = dateObject.toDateString();
                });
                $scope.commentsCount = data.length;
                $scope.comments = data;
            }, function(error){
                $scope.comments = [];
            });
            break;
        case 'posts.edit':
            var promise = PostsService.getPost($stateParams.id);
            promise.then(function(data){
                $scope.post = data.post;
            }, function(error){
                $scope.post = {};
                $log.log('Post getting failed');
            });
            break;
    }
    $scope.loadComments = function(){
        var promise = PostsService.getPostComments($stateParams.id);
        promise.then(function successCallback(data){
            data.forEach(function(comment){
                var dateObject = new Date(Date.parse(comment.created));
                comment.created = dateObject.toDateString();
            });
            $scope.commentsCount = data.length;
            $scope.comments = data;
        }, function errorCallback(error){
            var someAlert = $mdDialog.alert({
                title: 'Failed!',
                textContent: error,
                ok: 'OK'
            });
            $mdDialog
                .show(someAlert)
                .finally(function () {
                    someAlert = undefined;
                });
        });
    };

    $scope.create = function(post){
        var promise = PostsService.createPost(post);
        promise.then(function(data){
            var someAlert = $mdDialog.alert({
                title: 'Success!',
                textContent: 'Post successfully created! You will be redirected to posts page',
                ok: 'OK'
            });
            $mdDialog
                .show(someAlert)
                .finally(function () {
                    someAlert = undefined;
                });
            $state.go('posts.all');
            $log.log(data);
        }, function(error){
            var someAlert = $mdDialog.alert({
                title: 'Failed!',
                textContent: error,
                ok: 'OK'
            });
            $mdDialog
                .show(someAlert)
                .finally(function () {
                    someAlert = undefined;
                });
        });
    }
    $scope.remove = function(post){
        var promise = PostsService.deletePost(post);
        promise.then(function(data){
            var someAlert = $mdDialog.alert({
                title: 'Success!',
                textContent: data,
                ok: 'OK'
            });
            $mdDialog
                .show(someAlert)
                .finally(function () {
                    someAlert = undefined;
                });
            $state.go('posts.all');
        }, function(error){
            var someAlert = $mdDialog.alert({
                title: 'Failed!',
                textContent: error,
                ok: 'OK'
            });
            $mdDialog
                .show(someAlert)
                .finally(function () {
                    someAlert = undefined;
                });
        });

    }
    $scope.update = function(post){
        var promise = PostsService.editPost(post);
        promise.then(function successCallback(data){
            var someAlert = $mdDialog.alert({
                title: 'Success!',
                textContent: 'Post updated! You will redirected to show page',
                ok: 'OK'
            });
            $mdDialog
                .show(someAlert)
                .finally(function () {
                    someAlert = undefined;
                });
            $state.go('posts.show', {id: data.post._id});
        }, function errorCallback(error){
            var someAlert = $mdDialog.alert({
                title: 'Failed!',
                textContent: error,
                ok: 'OK'
            });
            $mdDialog
                .show(someAlert)
                .finally(function () {
                    someAlert = undefined;
                });
            $state.go('posts.show', {id: data._id});
        });

    }

    $scope.addComment = function(comment){
        var promise = PostsService.addComment($stateParams.id, comment);
        promise.then(function successCallback(data){
            var dateObject = new Date(Date.parse(data.created));
            data.created = dateObject.toDateString();
            $scope.comments.push(data);
            console.log($scope);
        }, function errorCallback(error){
            var alert = $mdDialog.alert({
                title: 'Attention!',
                textContent: error,
                ok: 'OK'
            });
            $mdDialog
                .show( alert )
                .finally(function() {
                    alert = undefined;
                });
        });
    }

    $scope.removeComment = function(comment){
        var promise = PostsService.removeComment(comment);
        promise.then(function successCallback(response){
            var removingElement = $scope.comments.indexOf(comment);
            if(removingElement != -1) {
                $scope.comments.splice(removingElement, 1);
            }
            $log.log($scope.comments);
        }, function errorCallback(error){
            var alert = $mdDialog.alert({
                title: 'Attention!',
                textContent: error,
                ok: 'OK'
            });
            $mdDialog
                .show( alert )
                .finally(function() {
                    alert = undefined;
                });
        });
    }

    $scope.ratePost = function(post, rating){
        if(rating < 1 || rating >5){
            var alert = $mdDialog.alert({
                title: 'Attention!',
                textContent: 'Rating must be in range 1..5',
                ok: 'OK'
            });
            $mdDialog
                .show( alert )
                .finally(function() {
                    alert = undefined;
                });
            return;
        }
        var promise = PostsService.votePost(post._id, rating);
        promise.then(function successCallback(data){
            $scope.rating = data;
            $scope.showRating = true;
        }, function errorCalback(error){
            var alert = $mdDialog.alert({
                title: 'Attention!',
                textContent: error,
                ok: 'OK'
            });
            $mdDialog
                .show( alert )
                .finally(function() {
                    alert = undefined;
                });
        });
    }
});


app.controller('SearchController', function($state, $scope, SearchService){
    $scope.criteria = 'title';
    $scope.posts = [];
    $scope.search = function(query, criteria){
        var promise = SearchService.findByTitle(query, criteria);
        promise.then(function successCallback(data){
            $scope.posts = data;
        }, function errorCallback(error){
            var alert = $mdDialog.alert({
                title: 'Attention!',
                textContent: error,
                ok: 'OK'
            });
            $mdDialog
                .show( alert )
                .finally(function() {
                    alert = undefined;
                });
        });
    }
});

app.controller('CommentsController', function(){

});

app.controller('MainController', function($location, $state, $mdDialog, $scope, AuthService){
    var promise = AuthService.isLogged();
    var self = this;
    promise.then(function(data){
        self.currentUser = data;
    }, function(error){
        self.currentUser = null;
    });
    this.logout = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Attention!')
            .textContent('Are you sure?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            var promise = AuthService.logout();

            promise.then(function(data){
                console.log('SUccess logged out');
                self.currentUser = null;
                $state.reload();
            }, function(error){
                console.log('Smth failed');
                $state.reload();
            });
        }, function() {});
    };
    this.login = function(user){
        var promise = AuthService.login(user);
        promise.then(function(data){
            self.currentUser = data;
            var someAlert = $mdDialog.alert({
                title: 'Success!',
                textContent: 'Successful logging in',
                ok: 'OK'
            });
            $mdDialog
                .show(someAlert)
                .finally(function () {
                    someAlert = undefined;
                });
            $state.go('home');
        }, function(error){
            var someAlert = $mdDialog.alert({
                title: 'Error!',
                textContent: error,
                ok: 'OK'
            });
            $mdDialog
                .show(someAlert)
                .finally(function () {
                    someAlert = undefined;
                });
        });
    }
    this.register = function(user){
        var promise = AuthService.register(user);

        promise.then(function(data){
            var alert = $mdDialog.alert({
                title: 'Congratulations!',
                textContent: 'Successful sign up!',
                ok: 'OK'
            });
            $mdDialog
                .show( alert )
                .finally(function() {
                    alert = undefined;
                });
            $state.go('home');
        }, function(error){
            var alert = $mdDialog.alert({
                title: 'Attention!',
                textContent: error,
                ok: 'OK'
            });
            $mdDialog
                .show( alert )
                .finally(function() {
                    alert = undefined;
                });
        });
    };
});