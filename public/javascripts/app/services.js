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
                deferred.reject(response.error.message);
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
        currentUser: function(){
            return currentUser;
        }
    };

});