'use strict';

angular.module('rezervoarApp')
    .factory('AuthenticationFactory', ['$http', 'SessionService', 'USER_ROLES',
        function ($http, SessionService, USER_ROLES) {

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
            }).then(function (response) {
                console.log("iz AuthenticationFactory: response.data:", JSON.stringify(response.data));
                if (response.data.error) {
                    return response;
                }

                var role;

                for (var i in response.data.groups) {
                    if (response.data.groups[i].name === 'Admin') {
                        role = USER_ROLES.admin;
                    }
                    else if (response.data.groups[i].name === 'Waiters') {
                        role = USER_ROLES.waiter;
                    }
                }

                if (role) {
                    SessionService.create(response.data.id, response.data.username, role);

                    return response;
                }

                response.data.error = 'You don\'t have permissions to access the requested page.';

                return response;
            });
        };

        factory.logout = function() {
            console.log("AuthenticationFactory: logout");
            SessionService.destroy();
        };

        factory.isAuthenticated = function () {
            console.log("AuthenticationFactory: isAuthenticated: ", !!SessionService.userId);
            return !!SessionService.userId;
        };

        factory.isAuthorized = function (authorizedRoles) {
            console.log("AuthenticationFactory: isAuthorized");
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (factory.isAuthenticated() &&
                authorizedRoles.indexOf(SessionService.userRole) !== -1);
        };

        return factory;
    }]);
