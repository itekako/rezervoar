'use strict';

angular.module('rezervoarApp')
    .factory('ReservationFactory', ['$http', function ($http) {
        var factory = {};

        var routes = {
            get: 'http://api-rezervoar:8000/' + 'table_management/api/tables/:label'
        };

        factory.getReservations = function(resDate, startTime, endTime, level) {
            console.log('iz reservation servisa:');
            console.log('iz reservation servisa: resDate: ' + resDate);
            console.log('iz reservation servisa: startTime: ' + startTime);
            console.log('iz reservation servisa: endTime: ' + endTime);
            console.log('iz reservation servisa: level: ' + level);
            // return $http({
            //     method: 'GET',
            //     //url: routes.get.replace(':label', label)
            //     url: routes.get.replace(':label', tableLabel)
            // });

            // za izabrano vreme 10:00-12:00h
            // vraca sve stolove,
            // sa vremenom pocetka i kraja rezervacije
            // ako s pocetak i kraj null
            // sto je slobodan
            var mockData = [
                {
                    tableLabel: 'a1',
                    seats: 4,
                    resDate: '18.04.',
                    startTime: '8:00',
                    endTime: '10:30',
                    comment: 'neki komentar'
                },
                {
                    tableLabel: 'a2',
                    seats: 3,
                    resDate: '18.04.',
                    startTime: '9:30',
                    endTime: '11:00',
                    comment: 'neki komentar 2'
                },
                {
                    tableLabel: 'a1',
                    seats: 2,
                    resDate: '18.04.',
                    startTime: '11:00',
                    endTime: '13:00',
                    comment: 'neki komentar 3'
                },
                {
                    tableLabel: 'a5',
                    seats: 4,
                    resDate: '18.04.',
                    startTime: null,
                    endTime: null,
                    comment: 'neki komentar 4'
                },
            ];

            return mockData;
        };

        return factory;
    }]);
