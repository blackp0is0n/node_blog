app.controller('AuthController', function($state, $scope, $http,$mdDialog, AuthService) {
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