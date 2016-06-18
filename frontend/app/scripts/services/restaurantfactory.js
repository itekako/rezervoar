'use strict';

angular.module('rezervoarApp')
    .factory('RestaurantFactory', ['$http', function ($http) {
        var factory = {};

        var routes = {
            get: 'http://api-rezervoar:8000/' + 'table_management/api/restaurant'
        };

        factory.getRestaurantDetails = function() {
            console.log('iz RestaurantFactory:');
            return $http({
                method: 'GET',
                url: routes.get
            });
        };

        return factory;
    }]);
