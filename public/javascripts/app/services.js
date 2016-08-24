app.factory('AuthService',function($http, $q){
    var currentUser;

    return {
        login: function(user){
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/sign_in',
                data:{user: user}
            }).then(function successCallback(response){
                deferred.resolve(response.data.user);

            }, function errorCallback(response, status){
                deffered.reject(response.error);
            });
            return deferred.promise;
        },
        register: function(user){
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/sign_up',
                data: {user: user}
            }).then(function successCallback(response) {
                deferred.resolve(response.data.user);
            }, function errorCallback(response) {
                deferred.reject(response.message);
            });
            return deferred.promise;
        },
        logout: function(user){
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: '/sign_out'
            }).then(function successCallback(response){
                deferred.resolve({})
            }, function errorCallback(response, status){
                deferred.reject(null);
            });
            return deferred.promise;
        },
        isLogged: function(){
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: '/check_auth'
            }).then(function successCallback(response){
                currentUser = response.data.user;
                deferred.resolve(response.data.user);
            }, function errorCallback(response, status){
                currentUser = null;
                deferred.reject(response.data.error);
            });

            return deferred.promise;
        },
        updateCurrentUser: function(user){
            var deferred = $q.defer();
            $http({
                method: "POST",
                url: '/update_profile',
                data: {user: user}
            }).then(function successCallback(response){
                deferred.resolve(response.data.user);
            }, function(response, status){
                deferred.reject(response.error.message);
            });

            return deferred.promise;
        },
        currentUser: function(){
            return currentUser;
        }
    };

});

app.service('PostsService', function($http, $q){
    return{
        createPost: function(post){
            var deferred = $q.defer();
            $http({
                method: "POST",
                url:'/posts',
                data: {post: post}
            }).then(function successCallback(response){
                deferred.resolve(response.data.post);
            }, function errorCallback(response, status){
                deferred.reject(response.data.error.message);
            });
            return deferred.promise;
        },
        getPost: function(id){
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: '/posts/'+ id
            }).then(function successCallback(response){
                deferred.resolve(response.data.post);
            }, function errorCallback(response, status){
                deferred.rject(response.data.error.message);
            });
            return deferred.promise;
        },
        editPost: function(post){
            var deferred = $q.defer();
            $http({
                method: "PUT",
                url: '/posts/' + post._id,
                data: {post: post}
            }).then(function successCallback(response){
                deferred.resolve({post: response.data.post, message: response.data.message});
            }, function errorCallback(response, status){
                deferred.reject(response.data.error.message);
            });
            return deferred.promise;
        },
        deletePost: function(post){
            var deferred = $q.defer();
            $http({
                method: "DELETE",
                url: '/posts/' + post._id
            }).then(function successCallback(response) {
               deferred.resolve(response.data.message);
            }, function errorCallback(response, status){
                deferred.reject(response.data.error.message);
            });
            return deferred.promise;
        },
        getAllPosts: function(){
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: '/posts'
            }).then(function successCallback(response){
                deferred.resolve(response.data.posts);
            }, function errorCallback(response, status){
                deferred.reject(response.data.error.message);
            });
            return deferred.promise;
        },
        addComment: function(post_id, comment){
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/posts/'+ post_id + '/new_comment',
                data: {comment: comment}
            }).then(function successCallback(response){
                deferred.resolve(response.data.comment);
            }, function errorCallback(response, status){
                deferred.reject(response.message);
            });
            return deferred.promise;
        },
        getPostComments: function(post_id){
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: '/posts/' + post_id + '/comments'
            }).then(function successCallback(response){
                deferred.resolve(response.data.comments);
            }, function errorCallback(response, status){
                deferred.reject(response.data.error.message);
            });
            return deferred.promise;
        },
        removeComment: function(comment){
            var deferred = $q.defer();
            $http({
                method: "DELETE",
                url: '/comments/' + comment._id
            }).then(function successCallback(response){
                deferred.resolve(response.data.message);
            }, function errorCallback(response, status){
                deferred.reject(response.error.message);
            });
            return deferred.promise;
        }
    };
});