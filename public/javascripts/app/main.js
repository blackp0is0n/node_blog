var app = angular.module('myApp', ['ui.router', 'ngMaterial']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/templates/home.html'
        })
        .state('about', {
        	url: '/about',
        	templateUrl: '/templates/about.html'    
        });
        
});