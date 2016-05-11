'use strict';

angular.module('rezervoarApp')
    .factory('AuthenticationFactory', ['$http', function ($http) {
        var factory = {};

        var routes = {
            get: 'http://api-rezervoar:8000/' + 'table_management/api/authentication/'
        };

        factory.login = function(credentials) {
            console.log("AuthenticationFactory: login, credentials", credentials);

            return $http({
                method: 'POST',
                url: routes.get,
                data: credentials
            });
        };

        // factory.logout = function() {
        //     console.log("AuthenticationFactory: logout");
        //     Session.destroy();
        // };
        //
        // factory.isAuthenticated = function () {
        //     console.log("AuthenticationFactory: isAuthenticated: ", !!Session.userId);
        //     return !!Session.userId;
        // };
        //
        // factory.isAuthorized = function (authorizedRoles) {
        //     console.log("AuthenticationFactory: isAuthorized");
        //     if (!angular.isArray(authorizedRoles)) {
        //         authorizedRoles = [authorizedRoles];
        //     }
        //     return (factory.isAuthenticated() &&
        //         authorizedRoles.indexOf(Session.userRole) !== -1);
        // };

        return factory;
    }]);
