'use strict';

angular.module('rezervoarApp')
    .factory('ReservationFactory', ['$http', function ($http) {
        var factory = {};

        var routes = {
            get: 'http://api-rezervoar:8000/' + 'table_management/api/tables/:label'
        };

        factory.getReservations = function(resDate, resTime, level) {
            console.log('iz reservation servisa:');

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
                    startDate: '8:00',
                    endDate: '10:30',
                    comment: 'neki komentar'
                },
                {
                    tableLabel: 'a2',
                    seats: 3,
                    startDate: '9:30',
                    endDate: '11:00',
                    comment: 'neki komentar 2'
                },
                {
                    tableLabel: 'a1',
                    seats: 2,
                    startDate: '11:00',
                    endDate: '13:00',
                    comment: 'neki komentar 3'
                },
                {
                    tableLabel: 'a5',
                    seats: 4,
                    startDate: null,
                    endDate: null,
                    comment: 'neki komentar 4'
                },
            ];

            return mockData;
        };

        return factory;
    }]);
