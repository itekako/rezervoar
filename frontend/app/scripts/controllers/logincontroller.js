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

    $scope.incorrectCredentials = null;
    $scope.error = '';

    $scope.login = function () {
        console.log("scope.login: credentials: ", $scope.credentials);

        AuthenticationFactory.login($scope.credentials).then(function (response) {
            console.log("auth: success, response:", response);
            console.log("auth: success, response.data:", response.data);

            if (response.data.error) {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                $scope.incorrectCredentials = true;
                $scope.error = response.data.error;
                console.log("LoginController: login: failed, error: ", response.data.error);
            } else {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                console.log("LoginController: login: uspelo", response.data);
                $scope.setCurrentUser(response.data.username);
                $scope.incorrectCredentials = null;
                console.log("lokacija: ", $location.path());
                $location.path('/reservations');
            }
        }, function (response) {
            console.log("auth: error, response:", response);
            console.log("auth: error, response.data:", response.data);
        });
    };

}]);
