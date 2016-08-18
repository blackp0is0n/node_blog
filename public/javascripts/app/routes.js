app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/templates/home.html'
        })
        .state('registration',{
            url: '/sign_up',
            templateUrl: '/templates/registration.html',
            controller: 'RegistrationController'
        })
        .state('about', {
            url: '/about',
            templateUrl: '/templates/about.html'
        });

});