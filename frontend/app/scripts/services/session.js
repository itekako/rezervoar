'use strict';

angular.module('rezervoarApp')
    .service('Session', function () {

        this.create = function (sessionId, userId, userRole) {
            console.log("Session: create");

            this.id = sessionId;
            this.userId = userId;
            this.userRole = userRole;
        };

        this.destroy = function () {
            console.log("Session: destroy");

            this.id = null;
            this.userId = null;
            this.userRole = null;
        };
    });
