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
            controller: 'AuthController',
            resolve: {isLogged: function(AuthService, $state){AuthService.isLogged().then(function(data){if (data){ $state.go('home') }},function(){})}}
        })
        .state('sign_in', {
            url: '/sign_in',
            templateUrl: '/templates/login.html',
            controller: 'AuthController',
            resolve: {isLogged: function(AuthService, $state){AuthService.isLogged().then(function(data){if (data){ $state.go('home') }},function(){})}}
        })
        .state('edit_profile', {
            url: '/edit_profile',
            templateUrl: '/templates/user_edit.html',
            controller: 'UsersController',
            resolve: {isLogged: function(AuthService, $state){AuthService.isLogged().then(function(data){if (!data){ $state.go('home') }},function(){ $state.go('home') })}}
        })
        .state('about', {
            url: '/about',
            templateUrl: '/templates/about.html'
        })
        .state('posts', {
            url: '/posts',
            templateUrl: '/templates/posts/index.html',
            controller: 'PostsController'
        })
        .state('posts.show', {
            url: '/posts/:id',
            templateUrl: '/templates/posts/show.html',
            controller: 'PostsController'
        })
        .state('posts.edit',{
            url: '/posts/:id/edit',
            templateUrl: '/templates/posts/edit.html',
            controller: 'PostsController'
        })
        .state('posts.new',{
            url: '/posts/new',
            templateUrl: '/templates/posts/new.html',
            controller: 'PostsController'
        });

});