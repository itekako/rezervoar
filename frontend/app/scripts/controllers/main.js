'use strict';

/**
 * @ngdoc function
 * @name rezervoarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rezervoarApp
 */
angular.module('rezervoarApp')
  .controller('MainCtrl', ['$scope', 'GuestFactory', function ($scope, GuestFactory) {

    $scope.getGuest = function () {
        GuestFactory.getGuest(1).then(function (response) {
            console.log('response: ', JSON.stringify(response));
            console.log('data: ', JSON.stringify(response.data));
            $scope.guest = response.data;
        },
        function (response) {
            console.log('response: ', JSON.stringify(response));
        });
    };

    $scope.getGuest();
}]);
