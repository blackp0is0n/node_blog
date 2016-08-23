app.controller('AuthController', function($state, $scope,$mdDialog, AuthService) {
});

app.controller('UsersController', function(AuthService, $state, $scope ){
	$scope.user = AuthService.currentUser();
	console.log($scope.currentUser);
});

app.controller('PostsController', function($scope,$log, $state, PostsService, $mdDialog, $stateParams){
    $log.log($state.$current.self.name);
    switch($state.$current.self.name){
        case 'posts.all':
            var promise = PostsService.getAllPosts();
            promise.then(function(data){
               $scope.posts = data;
            }, function(error){
                $scope.posts = [];
            });
            break;
        case 'posts.show':
            var promise = PostsService.getPost($stateParams.id);
            promise.then(function(data){
                $log.log('Success getting post');
                $scope.post = data;
            }, function(error){
                $scope.post = {};
                $log.log('Post getting failed');
            });
            break;
        case 'posts.edit':
            var promise = PostsService.getPost($stateParams.id);
            promise.then(function(data){
                $log.log('Success getting post');
                $scope.post = data;
            }, function(error){
                $scope.post = {};
                $log.log('Post getting failed');
            });
            break;
    }
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
            self.currentUser = data;
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