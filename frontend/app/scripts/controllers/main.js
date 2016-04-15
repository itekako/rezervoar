'use strict';

/**
 * @ngdoc function
 * @name rezervoarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rezervoarApp
 */
angular.module('rezervoarApp')
  .controller('MainCtrl', ['$scope', 'GuestFactory', 'TableFactory',
    'ReservationFactory', function ($scope, GuestFactory, TableFactory, ReservationFactory) {

    $scope.getGuest = function () {
        GuestFactory.getGuest(4).then(function (response) {
            console.log('iz getGuest: data: ', JSON.stringify(response.data));
            $scope.guest = response.data;
        },
        function (response) {
            console.log('guest error response: ', JSON.stringify(response));
        });
    };

    // $scope.getTables = function () {
    //     TableFactory.getTables('drugisprat').then(function (response) {
    //         console.log('iz getTables: data: ', JSON.stringify(response.data));
    //         $scope.tables = response.data;
    //     },
    //     function (response) {
    //         console.log('table error response: ', JSON.stringify(response));
    //     });
    // };

    $scope.getReservations = function () {
        $scope.tables = ReservationFactory.getReservations('nekidatum', 'nekovreme', 'nekisprat');
        for (var i in $scope.tables) {
            $scope.tables[i].taken = true;
        }
        $scope.tables[$scope.tables.length-1].taken = false;
        console.log('iz getReservations: $scope.tables: ', JSON.stringify($scope.tables));
        // ReservationFactory.getReservations('nekidatum', 'nekovreme', 'nekisprat').then(function (response) {
        //     console.log('iz getReservations: data: ', JSON.stringify(response.data));
        //     $scope.tables = response.data;
        // },
        // function (response) {
        //     console.log('reservation error response: ', JSON.stringify(response));
        // });
    };

    $scope.initialize = function() {
        //$scope.getGuest();
        //$scope.getTables();
        $scope.getReservations();
    };

    $scope.initialize();
}]);
