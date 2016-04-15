'use strict';

angular.module('rezervoarApp')
    .factory('GuestFactory', ['$http', function ($http) {
        var factory = {};

        var routes = {
            get: 'http://api-rezervoar:8000/' + 'table_management/api/guest/:id'
        };

        factory.getGuest = function(guestId) {
            console.log('iz guest servisa:');
            return $http({
                method: 'GET',
                url: routes.get.replace(':id', guestId)
            });
        };

        return factory;
    }]);
