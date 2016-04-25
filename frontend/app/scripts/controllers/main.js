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

    $scope.getReservations = function (resDate, startTime, endTime, level) {
        ReservationFactory.getReservations(resDate, startTime, endTime, level).then(function (response) {
            console.log('iz getReservations: data: ', JSON.stringify(response.data));
            $scope.tables = response.data.tables;
            console.log("iz getReservations: tables: ", JSON.stringify($scope.tables));
        },
        function (response) {
            console.log('reservation error response: ', JSON.stringify(response));
        });
    };

    $scope.slider = {
      minValue: 24,
      maxValue: 28,
      options: {
        // treba da stoji radno vreme restorana
        stepsArray: ['00:00', '00:30', '01:00', '01:30','02:00', '02:30',
        '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30',
        '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
        '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
        '23:00', '23:30'],
        noSwitching: true,
        minRange: 1,
        onChange: function () {
            $scope.startTime = this.stepsArray[$scope.slider.minValue];
            $scope.endTime = this.stepsArray[$scope.slider.maxValue];

            $scope.getReservations('nekidatum', $scope.startTime, $scope.endTime, 'drugisprat');
        }
      }
    };

    $scope.savePosition = function() {
        var proba = angular.element('a2');
        console.log("proba: ", JSON.stringify(proba.html()));
    };

    $scope.initialize = function() {
        $scope.startTime = $scope.slider.options.stepsArray[$scope.slider.minValue];
        $scope.endTime = $scope.slider.options.stepsArray[$scope.slider.maxValue];
        $scope.getReservations('nekidatum', $scope.startTime, $scope.endTime, 'drugisprat');
    };

    $scope.initialize();
}]);
