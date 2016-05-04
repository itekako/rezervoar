'use strict';

angular.module('rezervoarApp')
    .factory('AuthenticationInterceptor', function ($rootScope, $q, AUTH_EVENTS) {

            console.log("AuthenticationInterceptor:");
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized
                    // 419: AUTH_EVENTS.sessionTimeout,
                    // 440: AUTH_EVENTS.sessionTimeout
                }[response.status], response);

                return $q.reject(response);
            }
          };
    });
