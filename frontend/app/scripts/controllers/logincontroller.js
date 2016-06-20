'use strict';

/**
 * @ngdoc function
 * @name rezervoarApp.controller:LoginController
 * @description
 * # LoginController
 * Controller of the rezervoarApp
 */
angular.module('rezervoarApp')
    .controller('LoginController', ['$scope', '$rootScope', '$state',
        'AUTH_EVENTS', 'AuthenticationFactory', function ($scope, $rootScope,
        $state, AUTH_EVENTS, AuthenticationFactory) {

    $scope.credentials = {
        username: '',
        password: ''
    };

    $rootScope.loginSuccess = false;
    $scope.error = null;

    $scope.login = function () {
        console.log("scope.login: credentials: ", $scope.credentials);

        AuthenticationFactory.login($scope.credentials).then(function (response) {
            console.log("auth: success, response:", response);
            console.log("auth: success, response.data:", response.data);

            if (response.data.error) {
                $scope.error = response.data.error;
                $scope.loginError = true;
                console.log("LoginController: login: failed, error: ", response.data.error);
            } else {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                console.log("LoginController: login: uspelo", response.data);
                $scope.setCurrentUser(response.data.username);
                $scope.loginError = null;
                $state.go('home.reservations');
            }
        }, function (response) {
            console.log("auth: error, response:", response);
            console.log("auth: error, response.data:", response.data);
        });
    };

    $scope.$on(AUTH_EVENTS.loginSuccess, function () {
        console.log("IZ WATCHA SCOPE 0");
        $rootScope.loginSuccess = true;
        $scope.loginError = false;
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function () {
        console.log("IZ WATCHA SCOPE 1");
        $scope.error = 'The username or password are incorrect.';
        $scope.loginError = true;
        $rootScope.loginSuccess = false;
    });

    $scope.$on(AUTH_EVENTS.notAuthorized, function () {
        console.log("IZ WATCHA SCOPE 2");
        $scope.error = 'You don\'t have permissions to access the requested page.';
        $scope.loginError = true;
        $rootScope.false = true;
    });

}]);
