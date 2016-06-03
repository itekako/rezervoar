'use strict';

angular.module('rezervoarApp')
    .factory('ReservationFactory', ['$http', function ($http) {
        var factory = {};

        var routes = {
            getAll: 'http://api-rezervoar:8000/' + 'table_management/api/reservations/:date',
            getAllTables: 'http://api-rezervoar:8000/' + 'table_management/api/tables/',
            getById: 'http://api-rezervoar:8000/' + 'table_management/api/reservation/:id',
            add: 'http://api-rezervoar:8000/' + 'table_management/api/reservations/'
        };

        factory.getTables = function(resDate, startTime, endTime, level) {
            console.log('iz reservation servisa: getTables');
            console.log('iz reservation servisa: resDate: ' + resDate);
            console.log('iz reservation servisa: startTime: ' + startTime);
            console.log('iz reservation servisa: endTime: ' + endTime);
            console.log('iz reservation servisa: level: ' + level);

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

        factory.getReservations = function(date) {
            console.log('iz reservation servisa: getReservations, date', date);
            return $http({
                method: 'GET',
                url: routes.getAll.replace(':date', date)
            });
        };

        factory.getReservationById = function(id) {
            console.log('iz reservation servisa: getReservationById, id', id);
            return $http({
                method: 'GET',
                url: routes.getById.replace(':id', id)
            });
        };

        factory.addReservation = function(reservation) {
            console.log('iz reservation servisa: addReservation: reservation: ', JSON.stringify(reservation));

            return $http({
                method: 'POST',
                url: routes.add,
                data: {
                    firstName: reservation.firstName,
                    lastName: reservation.lastName,
                    phoneNumber: reservation.phoneNumber,
                    email: reservation.email,
                    numberOfGuests: reservation.numberOfGuests,
                    date: reservation.date,
                    startTime: reservation.startTime,
                    endTime: reservation.endTime,
                    tables: reservation.tables,
                    comment: reservation.comment,
                    username: reservation.loggedUser
                }
            });
        };

        return factory;
    }]);
