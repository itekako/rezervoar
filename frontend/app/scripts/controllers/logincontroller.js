'use strict';

/**
 * @ngdoc function
 * @name rezervoarApp.controller:LoginController
 * @description
 * # LoginController
 * Controller of the rezervoarApp
 */
angular.module('rezervoarApp')
    .controller('LoginController', ['$scope', '$rootScope', '$location',
        'AUTH_EVENTS', 'AuthenticationFactory', function ($scope, $rootScope,
        $location, AUTH_EVENTS, AuthenticationFactory) {

    $scope.credentials = {
        username: '',
        password: ''
    };

    $scope.login = function (credentials) {
        console.log("scope.login: credentials: ", $scope.credentials);

        // mock
        var user = AuthenticationFactory.login(credentials);
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        console.log("LoginController: login: user", user);
        $scope.setCurrentUser(user);
        console.log("lokacija: ", $location.path());
        $location.path('/reservations');

        // AuthenticationFactory.login(credentials).then(function (user) {
        //     $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        //     $scope.setCurrentUser(user);
        // }, function () {
        //     $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        // });
    };

}]);
