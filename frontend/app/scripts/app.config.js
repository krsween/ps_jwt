'use strict';

/**
 * @ngdoc overview
 * @name psJwtApp
 * @description
 * # psJwtApp
 *
 * Main module of the application.
 */
angular.module('psJwtApp')
  .config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'views/main.html'
      })
      .state('jobs', {
        url: '/',
        templateUrl: 'views/jobs.html',
        controller: 'JobsCtrl'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('logout', {
        url: '/logout',
        //templateUrl: 'views/register.html',
        controller: 'LogoutCtrl'
      });



    $httpProvider.interceptors.push('authInterceptor');
  })
  .constant('API_URL', 'http://localhost:3000/')
  .run(function($window){

    var params = $window.location.search.substr(1);

    if (params && $window.opener && $window.opener.location.origin === $window.location.origin) {
      var pair = params.split('=');
      var code = decodeURIComponent(pair[1]);

      $window.opener.postMessage(code, $window.location.origin);
    }

  });
