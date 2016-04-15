'use strict';

angular.module('rezervoarApp')
    .factory('TableFactory', ['$http', function ($http) {
        var factory = {};

        var routes = {
            get: 'http://api-rezervoar:8000/' + 'table_management/api/tables/:label'
        };

        factory.getTables = function(tableLabel) {
            console.log('iz table servisa:');
            return $http({
                method: 'GET',
                //url: routes.get.replace(':label', label)
                url: routes.get.replace(':label', tableLabel)
            });
        };

        return factory;
    }]);
