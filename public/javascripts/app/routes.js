app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/templates/index.html'
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
            controller: 'UsersUpdateController',
            resolve: {isLogged: function(AuthService, $state){AuthService.isLogged().then(function(data){if (!data){ $state.go('home') }},function(){ $state.go('home') })}}
        })
        .state('about', {
            url: '/about',
            templateUrl: '/templates/about.html'
        })
        .state('posts', {
            abstract: true,
            url: '/posts',
            template: "<div ui-view></div>"
        })
        .state('posts.all',{
            url: '/all',
            templateUrl: '/templates/posts/index.html',
            controller: 'PostsController'
        })
        .state('posts.show', {
            url: '/show/:id',
            templateUrl: '/templates/posts/show.html',
            controller: 'PostsController'
        })
        .state('posts.edit',{
            url: '/edit/:id',
            templateUrl: '/templates/posts/edit.html',
            controller: 'PostsController',
            resolve: {isLogged: function(AuthService, $state){AuthService.isLogged().then(function(data){if (!data){ $state.go('home') }},function(){ $state.go('home') })}}
        })
        .state('user_posts',{
            url: '/:id/posts',
            templateUrl: '/templates/users/posts.html',
            controller: 'UsersController'
        })
        .state('posts.new',{
            url: '/new',
            templateUrl: '/templates/posts/new.html',
            controller: 'PostsController',
            resolve: {isLogged: function(AuthService, $state){AuthService.isLogged().then(function(data){if (!data){ $state.go('home') }},function(){ $state.go('home') })}}
        })
        .state('search',{
            url: '/search',
            templateUrl: '/templates/posts/search_results.html',
            controller: 'SearchController'
        });

});