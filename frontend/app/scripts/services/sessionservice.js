'use strict';

angular.module('rezervoarApp')
    .service('SessionService', function () {

        console.log("Session servis:");

        this.create = function (userId, username, role) {
            this.userId = userId;
            this.username = username;
            this.userRole = role;
        };

        this.destroy = function () {
            this.userId = null;
            this.username = null;
            this.userRole = null;
        };
    });
