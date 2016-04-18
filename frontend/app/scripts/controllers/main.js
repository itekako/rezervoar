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

    $scope.slider = {
      minValue: '02:00',
      maxValue: '14:00',
      options: {
        stepsArray: ['00:00', '00:30', '01:00', '01:30','02:00', '02:30',
        '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30',
        '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
        '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
        '23:00', '23:30']
      }
    };

    $scope.initialize = function() {
        //$scope.getGuest();
        //$scope.getTables();
        $scope.getReservations();
    };

    $scope.initialize();
}]);
