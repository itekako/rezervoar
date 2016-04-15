'use strict';

/**
 * @ngdoc overview
 * @name rezervoarApp
 * @description
 * # rezervoarApp
 *
 * Main module of the application.
 */
angular
  .module('rezervoarApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'index.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
    //   .when('/about', {
    //     templateUrl: 'views/about.html',
    //     controller: 'AboutCtrl',
    //     controllerAs: 'about'
    //   })
    //   .when('/blabla', {
    //     templateUrl: 'views/blabla.html',
    //     controller: 'MainCtrl',
    //     controllerAs: 'main'
    //   })
      .otherwise({
        redirectTo: '/'
      });
  });
