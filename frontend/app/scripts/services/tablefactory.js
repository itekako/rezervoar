'use strict';

angular.module('rezervoarApp')
    .factory('TableFactory', ['$http', function ($http) {
        var factory = {};

        var routes = {
            get: 'http://api-rezervoar:8000/' + 'table_management/api/tables-per-level/:label',
            update: 'http://api-rezervoar:8000/' + 'table_management/api/tables/'
        };

        factory.getTables = function(tableLabel) {
            console.log('iz table servisa:');
            return $http({
                method: 'GET',
                url: routes.get.replace(':label', tableLabel)
            });
        };

        factory.updateTables = function(tables) {
            console.log("iz TableFactory, updateTables: ", JSON.stringify(tables));
            return $http({
                method: 'PUT',
                url: routes.update,
                data: {
                    tables: tables
                }
            });
        };

        return factory;
    }]);
