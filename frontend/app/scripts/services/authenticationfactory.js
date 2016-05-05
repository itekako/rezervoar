'use strict';

angular.module('rezervoarApp')
    .factory('AuthenticationFactory', ['$http', 'Session', function ($http, Session) {
        var factory = {};

        var routes = {
            //get: 'http://api-rezervoar:8000/' + 'table_management/api/guest/:id'
        };

        factory.login = function(credentials) {
            console.log("AuthenticationFactory: login");

            // mock
                var res = {
                    data: {
                        id: 1,
                        user: {
                            id: 11,
                            role: 'admin',
                            username: 'Magdalena'
                        }
                    }
                };

                Session.create(res.data.id, res.data.user.id, res.data.user.role);
                return res.data.user;

            // return $http
            // .post('/login', credentials)
            // .then(function (res) {
            //     Session.create(res.data.id, res.data.user.id, res.data.user.role);
            //     return res.data.user;
            // });
        };

        factory.logout = function() {
            console.log("AuthenticationFactory: logout");
            Session.destroy();
        };

        factory.isAuthenticated = function () {
            console.log("AuthenticationFactory: isAuthenticated: ", !!Session.userId);
            return !!Session.userId;
        };

        factory.isAuthorized = function (authorizedRoles) {
            console.log("AuthenticationFactory: isAuthorized");
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (factory.isAuthenticated() &&
                authorizedRoles.indexOf(Session.userRole) !== -1);
        };

        return factory;
    }]);
