'use strict';

/**
 * @ngdoc function
 * @name rezervoarApp.controller:MainController
 * @description
 * # MainController
 * Controller of the rezervoarApp
 */
angular.module('rezervoarApp')
    .controller('MainController', ['$scope', '$rootScope', '$location', 'USER_ROLES',
        'GuestFactory', 'TableFactory', 'ReservationFactory', 'AuthenticationFactory',
        function ($scope, $rootScope, $location, USER_ROLES, GuestFactory, TableFactory,
        ReservationFactory, AuthenticationFactory) {

    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthenticationFactory.isAuthorized;

    $scope.setCurrentUser = function (user) {
        console.log("scope.setCurrentUser");
        console.log("scope.setCurrentUser: user: ", user);
        $scope.currentUser = user;
    };


    $scope.logout = function () {
        console.log("scope.logout: currentUser: ", $scope.currentUser);
        AuthenticationFactory.logout();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        $scope.currentUser = null;
        console.log("scope.logout: currentUser 2: ", $scope.currentUser);
        $location.path('/login');
    };

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
        ReservationFactory.getReservations(resDate, startTime, endTime, level)
            .then(function (response) {
                console.log('iz getReservations: data: ', JSON.stringify(response.data));
                $scope.tables = response.data.tables;

                // mockovani podaci
                var bla = 200;
                var bla2 = 50;
                for (var i in $scope.tables) {
                    $scope.tables[i].position = {};
                    $scope.tables[i].position.top = bla;
                    $scope.tables[i].position.left = bla;
                    bla = bla + 50;

                    $scope.tables[i].dimensions = {};
                    $scope.tables[i].dimensions.height = bla2;
                    $scope.tables[i].dimensions.width = bla2;
                    bla2 = bla2 + 30;
                }

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

    $scope.scaleIntervals = function (evt, ui) {
        $rootScope.$broadcast('scaleIntervals', {
            id: ui.element[0].id,
            width: ui.size.width
        });
    };

    $scope.savePosition = function(evt, ui) {
        console.log("savePosition");

        for (var i in $scope.tables) {
            if ($scope.tables[i].label === ui.helper[0].id.substring(0, ui.helper[0].id.lastIndexOf('-'))) {
                $scope.tables[i].position.top = ui.position.top;
                $scope.tables[i].position.left = ui.position.left;
                break;
            }
        }
    };

    $scope.saveDimensions = function(evt, ui) {
        console.log("saveDimensions");

        for (var i in $scope.tables) {
            if ($scope.tables[i].label === ui.helper[0].id.substring(0, ui.helper[0].id.lastIndexOf('-'))) {
                $scope.tables[i].dimensions.height = ui.size.height;
                $scope.tables[i].dimensions.width = ui.size.width;
                break;
            }
        }
    };

    $scope.saveLayout = function() {
        console.log("iz saveLayout, tables: ", JSON.stringify($scope.tables));
        TableFactory.updateTables($scope.tables).then(function(response) {
            console.log("saveLayout: success");
        }, function(response) {
            console.log("saveLayout: error");
        });
    };

    $scope.initialize = function() {
        $scope.startTime = $scope.slider.options.stepsArray[$scope.slider.minValue];
        $scope.endTime = $scope.slider.options.stepsArray[$scope.slider.maxValue];
        $scope.getReservations('nekidatum', $scope.startTime, $scope.endTime, 'drugisprat');
    };

    $scope.initialize();

}]);