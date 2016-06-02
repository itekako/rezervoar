'use strict';

angular.module('rezervoarApp')
    .factory('LevelFactory', ['$http', function ($http) {
        var factory = {};

        var routes = {
            get: 'http://api-rezervoar:8000/' + 'table_management/api/levels'
        };

        factory.getLevels = function() {
            console.log('iz LevelFactory: getLevels:');
            return $http({
                method: 'GET',
                url: routes.get
            });
        };

        return factory;
    }]);
