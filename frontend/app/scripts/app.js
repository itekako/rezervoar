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
        'ui.router',
        'ngTagsInput'
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
        all: '*',
        admin: 'admin',
        waiter: 'waiter'
    })
    .config(function($stateProvider, $urlRouterProvider, $httpProvider, USER_ROLES) {
        $urlRouterProvider.when("", "/login");
        $urlRouterProvider.when("/", "/login");
        $urlRouterProvider.otherwise("/login");

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginController',
                data: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .state('home', {
                url: '/home',
                abstract: true,
                templateUrl: 'views/main.html',
                controller: 'MainController',
                data: {
                  authorizedRoles: [USER_ROLES.admin, USER_ROLES.waiter]
                }
            })
            .state('home.reservations', {
                url: '',
                templateUrl: 'views/reservations.html',
                data: {
                  authorizedRoles: [USER_ROLES.admin, USER_ROLES.waiter]
                }
            })
            .state('home.newreservation', {
                url: '/newreservation',
                templateUrl: 'views/newreservation.html',
                data: {
                  authorizedRoles: [USER_ROLES.admin, USER_ROLES.waiter]
                }
            })
            .state('home.editreservation', {
                url: '/editreservation/:id',
                templateUrl: 'views/editreservation.html',
                params: {
                    reservation: null
                },
                data: {
                  authorizedRoles: [USER_ROLES.admin, USER_ROLES.waiter]
                }
            });

            $httpProvider.interceptors.push(['$injector',
                function ($injector) {
                    return $injector.get('AuthInterceptorFactory');
                }
            ]);
    })
    .run(function ($rootScope, AUTH_EVENTS, AuthenticationFactory) {
        $rootScope.$on('$stateChangeStart', function (event, next) {
            if (next) {
                console.log("next je ok", JSON.stringify(next));
            }
            var authorizedRoles = next.data.authorizedRoles;
            if (authorizedRoles.indexOf('*') === -1 && !AuthenticationFactory.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                console.log("IZ RUNA");
                if (AuthenticationFactory.isAuthenticated()) {
                    // user is not allowed
                    console.log("PRVI IF");
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    console.log("DRUGI IF");
                    // user is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
        });
})
