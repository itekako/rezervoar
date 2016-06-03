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
        'ngTouch',
        'rzModule',
        'ui.bootstrap',
        'ui.router'
    ])
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        //sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    .constant('USER_ROLES', {
        //all: '*',
        admin: 'admin',
        waiter: 'waiter'
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when("", "/home");
        $urlRouterProvider.when("/", "/home");
        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state('home', {
                url: '/home',
                abstract: true,
                templateUrl: 'views/main.html',
                controller: 'MainController'
            })
            .state('home.reservations', {
                url: '',
                templateUrl: 'views/reservations.html'
            })
            .state('home.newreservation', {
                url: '/newreservation',
                templateUrl: 'views/newreservation.html'
            })
            .state('home.editreservation', {
                url: '/editreservation/:id',
                templateUrl: 'views/editreservation.html',
                params: {
                    reservation: null
                }
            });
    });

    // .run(function ($rootScope, AUTH_EVENTS, AuthenticationFactory) {
    //     $rootScope.$on('$stateChangeStart', function (event, next) {
    //         console.log("run: onStateChangeStart");
    //         var authorizedRoles = next.data.authorizedRoles;
    //         if (!AuthenticationFactory.isAuthorized(authorizedRoles)) {
    //             console.log("run: onStateChangeStart: iz ifa");
    //             event.preventDefault();
    //             if (AuthenticationFactory.isAuthenticated()) {
    //                 console.log("run: onStateChangeStart: iz drugog ifa");
    //                 $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
    //             } else {
    //                 console.log("run: onStateChangeStart: iz elsa");
    //                 $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    //             }
    //         }
    //     });
    // });
