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
        'ui.bootstrap'
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
    .config(function ($routeProvider, $httpProvider, USER_ROLES) {
        $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/reservations', {
            templateUrl: 'views/main.html',
            controller: 'MainController',
            controllerAs: 'main',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.waiter]
            }
        })
        .otherwise({
            redirectTo: '/login'
        });

        $httpProvider.interceptors.push(['$injector', function ($injector) {
            return $injector.get('AuthenticationInterceptor');
        }]);
    })
    .run(function ($rootScope, AUTH_EVENTS, AuthenticationFactory) {
        $rootScope.$on('$stateChangeStart', function (event, next) {
            console.log("run: onStateChangeStart");
            var authorizedRoles = next.data.authorizedRoles;
            if (!AuthenticationFactory.isAuthorized(authorizedRoles)) {
                console.log("run: onStateChangeStart: iz ifa");
                event.preventDefault();
                if (AuthenticationFactory.isAuthenticated()) {
                    console.log("run: onStateChangeStart: iz drugog ifa");
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    console.log("run: onStateChangeStart: iz elsa");
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
        });
    });;
