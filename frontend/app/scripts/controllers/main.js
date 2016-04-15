'use strict';

/**
 * @ngdoc function
 * @name rezervoarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rezervoarApp
 */
angular.module('rezervoarApp')
  .controller('MainCtrl', ['$scope', 'GuestFactory', 'TableFactory', function ($scope, GuestFactory, TableFactory) {

    $scope.getGuest = function () {
        GuestFactory.getGuest(4).then(function (response) {
            console.log('response: ', JSON.stringify(response));
            console.log('data: ', JSON.stringify(response.data));
            $scope.guest = response.data;
        },
        function (response) {
            console.log('response: ', JSON.stringify(response));
        });
    };

    $scope.getTables = function () {
        TableFactory.getTables('drugisprat').then(function (response) {
            console.log('response: ', JSON.stringify(response));
            console.log('data: ', JSON.stringify(response.data));
            $scope.tables = response.data;
        },
        function (response) {
            console.log('response: ', JSON.stringify(response));
        });
    };

    $scope.initialize = function() {
        $scope.getGuest();
        $scope.getTables();
    };

    $scope.initialize();
}]);
