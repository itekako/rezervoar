'use strict';

angular.module('rezervoarApp')
    .factory('ReservationFactory', ['$http', function ($http) {
        var factory = {};

        var routes = {
            getAll: 'http://api-rezervoar:8000/' + 'table_management/api/reservations/20-04-2016',
            getAllTables: 'http://api-rezervoar:8000/' + 'table_management/api/tables/'
        };

        factory.getTables = function(resDate, startTime, endTime, level) {
            console.log('iz reservation servisa: getTables');
            console.log('iz reservation servisa: resDate: ' + resDate);
            console.log('iz reservation servisa: startTime: ' + startTime);
            console.log('iz reservation servisa: endTime: ' + endTime);
            console.log('iz reservation servisa: level: ' + level);
            //resDate = '20.04.2016';
            return $http({
                method: 'POST',
                url: routes.getAllTables,
                data: {
                    date: resDate,
                    startTime: startTime,
                    endTime: endTime,
                    level: level
                }
            });
        };

        factory.getReservations = function() {
            console.log('iz reservation servisa: getReservations');
            // ISPRAVI ZAKUCAN DATUM IZ RUTE
            return $http({
                method: 'GET',
                url: routes.getAll
            });
        };

        return factory;
    }]);
