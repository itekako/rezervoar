'use strict';

angular.module('rezervoarApp')
    .factory('ReservationFactory', ['$http', function ($http) {
        var factory = {};

        var routes = {
            getAll: 'http://api-rezervoar:8000/' + 'table_management/api/tables/'
        };

        factory.getReservations = function(resDate, startTime, endTime, level) {
            console.log('iz reservation servisa:');
            console.log('iz reservation servisa: resDate: ' + resDate);
            console.log('iz reservation servisa: startTime: ' + startTime);
            console.log('iz reservation servisa: endTime: ' + endTime);
            console.log('iz reservation servisa: level: ' + level);
            //resDate = '20.04.2016';
            return $http({
                method: 'POST',
                url: routes.getAll,
                data: {
                    date: resDate,
                    startTime: startTime,
                    endTime: endTime,
                    level: level
                }
            });
        };

        return factory;
    }]);
