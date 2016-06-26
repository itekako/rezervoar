'use strict';

/**
 * @ngdoc function
 * @name rezervoarApp.controller:MainController
 * @description
 * # MainController
 * Controller of the rezervoarApp
 */
angular.module('rezervoarApp')
    .controller('MainController', ['$scope', '$rootScope', '$filter', '$state',
        '$timeout', '$compile', '$templateRequest', 'AUTH_EVENTS', 'USER_ROLES',
        'GuestFactory', 'TableFactory', 'ReservationFactory', 'AuthenticationFactory',
        'LevelFactory', 'RestaurantFactory',
        function ($scope, $rootScope, $filter, $state, $timeout, $compile,
        $templateRequest, AUTH_EVENTS, USER_ROLES, GuestFactory, TableFactory,
        ReservationFactory, AuthenticationFactory, LevelFactory, RestaurantFactory) {

    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthenticationFactory.isAuthorized;

    $scope.loadTags = function(query) {
        return $scope.tables;
    };

    $scope.setCurrentUser = function (user) {
        console.log("scope.setCurrentUser: user: ", user);
        $scope.currentUser = {};
        $scope.currentUser.username = user.username;
        $scope.currentUser.userRole = user.groups[0].name || null;
        $scope.getLevels();
    };

    $scope.logout = function () {
        console.log("scope.logout: currentUser: ", $scope.currentUser);
        AuthenticationFactory.logout();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        $scope.currentUser = null;
        $rootScope.loginSuccess = false;
        console.log("scope.logout: currentUser 2: ", $scope.currentUser);
        $state.go('login');
    };

    $scope.formatDateTime = function (format) {
        if (!$scope.dt) {
            $scope.today();
        }
        return $filter('date')($scope.dt, format);
    }

    $scope.getGuest = function () {
        GuestFactory.getGuest(4).then(function (response) {
            console.log('iz getGuest: data: ', JSON.stringify(response.data));
            $scope.guest = response.data;
        },
        function (response) {
            console.log('guest error response: ', JSON.stringify(response));
        });
    };

    $scope.getLevels = function() {
        LevelFactory.getLevels().then(function (response) {
            console.log('iz getLevels: data: ', JSON.stringify(response.data));
            $scope.levels = response.data;
            $scope.selectedLevelIndex = 0;
            $scope.selectedLevel = $scope.levels[$scope.selectedLevelIndex];
        }, function (response) {
            console.log('getLevels error response: ', JSON.stringify(response));
        });
    };

    $scope.getTables = function () {
        var dateTime = $scope.formatDateTime('dd.MM.yyyy');
        var startTime = $scope.slider.minValue;
        var endTime = $scope.slider.maxValue;
        var level = $scope.selectedLevel.label;

        $scope.startTime = startTime;
        $scope.endTime = endTime;

        ReservationFactory.getTables(dateTime, startTime, endTime, level)
            .then(function (response) {
                console.log('iz getTables: data: ', JSON.stringify(response.data));
                $scope.tables = response.data.tables;

                angular.element('#tables-div').scope().tables = $scope.tables;

                // potrebno svojstvo 'text' zbog ngTagsInput direktive
                for (var i in $scope.tables) {
                    $scope.tables[i].text = $scope.tables[i].label;
                }

                $templateRequest("views/tables.html").then(function(html){
                    var template = angular.element(html);
                    angular.element(document.getElementById('tables-div')).html($compile(template)($scope));
                });
            },
            function (response) {
                console.log('getTables error response: ', JSON.stringify(response));
            });
    };

    $scope.getReservations = function () {
        var dateTime = $scope.formatDateTime('dd-MM-yyyy');

        ReservationFactory.getReservations(dateTime)
            .then(function (response) {
                console.log('iz getReservations: data.reservations: ', JSON.stringify(response.data.reservations));
                $scope.reservations = response.data.reservations;
                for (var i in $scope.reservations) {
                    $scope.reservations[i].startTime = $scope.reservations[i].startDate.split(' ')[1];
                    $scope.reservations[i].endTime = $scope.reservations[i].endDate.split(' ')[1];
                }
            },
            function (response) {
                console.log('reservation error response: ', JSON.stringify(response));
            });
    };

    $scope.initializeSlider = function (steps) {
        $scope.slider.options.stepsArray = [];
        for (var k in steps) {
            $scope.slider.options.stepsArray[k] = {value: steps[k]};
        }

        $scope.slider.minValue = steps[9];
        $scope.slider.maxValue = steps[13];
    };

    $scope.getWorkingHours = function () {
        RestaurantFactory.getRestaurantDetails().then(function (response) {
            console.log('iz getWorkingHours: data: ', JSON.stringify(response.data));

            var openingTime = response.data.opening_time.split(':');
            var closingTime = response.data.closing_time.split(':');

            var openingHour = openingTime[0];
            var openingMinutes = openingTime[1];
            var closingHour = closingTime[0];
            var closingMinutes = closingTime[1];

            var workingHours;
            var workingMinutes;
            if ((openingMinutes === '00' && closingMinutes === '00') ||
                (openingMinutes === '30' && closingMinutes === '30')) {
                    if (closingHour > openingHour) {
                        workingHours = parseInt(closingHour, 10) - parseInt(openingHour, 10);
                    }
                    else {
                        workingHours = 24 - parseInt(openingHour, 10) + parseInt(closingHour, 10);
                    }
                    workingMinutes = 0;
                }
            else if (openingMinutes === '30' && closingMinutes === '00') {
                if (closingHour > openingHour) {
                    workingHours = parseInt(closingHour, 10) - parseInt(openingHour, 10) - 1;
                }
                else {
                    workingHours = 24 - parseInt(openingHour, 10) + parseInt(closingHour, 10) - 1;
                }
                workingMinutes = 30;
            }
            // openingMinutes === '00' && closingMinutes === '30'
            else {
                if (closingHour > openingHour) {
                    workingHours = parseInt(closingHour, 10) - parseInt(openingHour, 10);
                }
                else {
                    workingHours = 24 - parseInt(openingHour, 10) + parseInt(closingHour, 10);
                }
                workingMinutes = 30;
            }

            var n;
            if (workingMinutes === 0) {
                n = workingHours * 2;
            }
            else {
                n = workingHours * 2 + 1;
            }

            var steps = [];
            var currHour = parseInt(openingHour, 10);
            var i;
            for (i = 0; i <= n; i++) {
                if (currHour < 24) {
                    if (i % 2 === 0) {
                        if (workingMinutes === 0) {
                            steps[i] = currHour + ':00';
                        }
                        else {
                            steps[i] = currHour + ':30';
                            currHour++;
                        }
                    }
                    else {
                        if (workingMinutes === 0) {
                            steps[i] = currHour + ':30';
                            currHour++;
                        }
                        else {
                            steps[i] = currHour + ':00';
                        }
                    }
                }
                else {
                    break;
                }
            }

            currHour = 0;
            for ( ; i <= n; i++) {
                if (i % 2 === 0) {
                    if (workingMinutes === 0) {
                        steps[i] = currHour + ':00';
                    }
                    else {
                        steps[i] = currHour + ':30';
                        currHour++;
                    }
                }
                else {
                    if (workingMinutes === 0) {
                        steps[i] = currHour + ':30';
                        currHour++;
                    }
                    else {
                        steps[i] = currHour + ':00';
                    }
                }
            }

            $scope.initializeSlider(steps);

            $scope.getTables();

        }, function (response) {
            console.log('getWorkingHours error response: ', JSON.stringify(response));
        });
    };

    $scope.slider = {
      options: {
        noSwitching: true,
        minRange: 1,
        showTicks: true,
        ticksTooltip: function(v) {
            return this.stepsArray[v].value;
        },
        onChange: function () {
            $scope.getTables();
        }
      }
    };

    $scope.scaleIntervals = function (evt, ui) {
        $rootScope.$broadcast('scaleIntervals', {
            id: ui.element[0].id,
            width: ui.size.width
        });
    };

    $scope.savePosition = function(evt, ui) {
        for (var i in $scope.tables) {
            if ($scope.tables[i].label === ui.helper[0].id.substring(0, ui.helper[0].id.lastIndexOf('-'))) {
                $scope.tables[i].position.top = ui.position.top;
                $scope.tables[i].position.left = ui.position.left;
                break;
            }
        }

        console.log("iz savePosition: tables: ", $scope.tables);
    };

    $scope.saveDimensions = function(evt, ui) {
        for (var i in $scope.tables) {
            if ($scope.tables[i].label === ui.helper[0].id.substring(0, ui.helper[0].id.lastIndexOf('-'))) {
                $scope.tables[i].dimensions.height = ui.size.height;
                $scope.tables[i].dimensions.width = ui.size.width;
                break;
            }
        }
        console.log("iz saveDimensions: tables: ", $scope.tables);
    };

    $scope.saveLayout = function() {
        console.log("iz saveLayout: tables: ", $scope.tables);
        TableFactory.updateTables($scope.tables).then(function(response) {
            console.log("saveLayout: success: response: ", response);
        }, function(response) {
            console.log("saveLayout: error: response: ", response);
        });
    };

    $scope.today = function() {
        $scope.dt = new Date();
        console.log("iz today: dt", $scope.dt);
    };

    $scope.clear = function() {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date()
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2050, 5, 22),
        minDate: new Date(2016, 1, 1),
        startingDay: 1,
        showWeeks: false
    };

    $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open = function() {
        $scope.popup.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.format = 'dd.MM.yyyy';

    $scope.popup = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();

    afterTomorrow.setDate(tomorrow.getDate() + 1);

    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];

    function getDayClass(data) {
        var date = data.date,
        mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
                console.log("iz getDayClass: currentDay",currentDay);
                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }

    $scope.$watch('dt', function() {
        if ($scope.selectedLevel) {
            $scope.getTables();
            $scope.getReservations();
        }
    });

    $scope.updateIndex = function (index) {
        $scope.selectedLevelIndex = index;
        $scope.selectedLevel = $scope.levels[$scope.selectedLevelIndex];
        angular.element('#tables-div').scope().selectedLevel = $scope.selectedLevel;

        $scope.getWorkingHours();
    };

    $scope.addReservation = function () {
        console.log("iz addReservation: currentUser: ", $scope.currentUser);
        $scope.res.loggedUser = $scope.currentUser;
        $scope.res.date = $scope.formatDateTime('d.M.yyyy');
        $scope.res.numberOfGuests = $scope.res.number_of_guests;

        for (var i in $scope.res.tables) {
            $scope.res.tables[i] = $scope.res.tables[i].label;
        }

        console.log("reservation podaci: ", JSON.stringify($scope.res));

        ReservationFactory.addReservation($scope.res).then(function (response) {
            console.log("iz addReservation: data: ", JSON.stringify(response.data));

            $scope.getTables();
            $scope.res = {};
            $scope.getReservations();
        }, function (response) {
            console.log("addReservation error: response: ", JSON.stringify(response));
        });
    };

    $scope.getReservation = function (index) {
        var res = $scope.reservations[index];
        console.log("iz getReservation: res: ", JSON.stringify(res));
        ReservationFactory.getReservationById(res.id).then(function (response) {
            console.log("iz getReservation: data: ", JSON.stringify(response.data));

            $scope.res = response.data;
            $scope.res.startTime = $scope.res.startDate.split(' ')[1];
            $scope.res.endTime = $scope.res.endDate.split(' ')[1];

            var tables = $scope.res.tables.split(',');
            $scope.res.tables = [];
            for (var i in tables) {
                $scope.res.tables[i] = {};
                $scope.res.tables[i].text = tables[i];
            }
            console.log("iz getReservation: $scope.res: ", JSON.stringify($scope.res));
        }, function (response) {
            console.log("getReservation error: response: ", JSON.stringify(response));
        });
    };

    $scope.editReservation = function () {
        var startDt = $scope.res.startDate.split(' ');
        startDt[1] = $scope.res.startTime;
        $scope.res.startDate = startDt[0] + ' ' + startDt[1];
        var endDt = $scope.res.endDate.split(' ');
        endDt[1] = $scope.res.endTime;
        $scope.res.endDate = endDt[0] + ' ' + endDt[1];

        var tables = $scope.res.tables;
        $scope.res.tables = [];
        for (var i in tables) {
            $scope.res.tables.push(tables[i].text);
        }

        console.log("iz editReservation: scope.res: ", JSON.stringify($scope.res));
        ReservationFactory.editReservation($scope.res).then(function (response) {
            console.log("iz editReservation: data: ", JSON.stringify(response.data));

            $scope.res = {};
            $scope.getReservations();
        }, function (response) {
            console.log("edtReservation error: response: ", JSON.stringify(response));
        });
    };

    $scope.cancelReservation = function (index) {
        var confirmed = $scope.confirmCanceling();
        if (confirmed) {
            var res = $scope.reservations[index];
            console.log("iz cancelReservation: res: ", JSON.stringify(res));
            ReservationFactory.cancelReservation(res.id).then(function (response) {
                console.log("iz cancelReservation: data: ", JSON.stringify(response.data));

                $scope.res = {};
                $scope.getReservations();
            }, function (response) {
                console.log("cancelReservation error: response: ", JSON.stringify(response));
            });
        }
    };

    $scope.confirmCanceling = function () {
        var msg = 'Da li zaista želite da otkažete rezervaciju?';
        return window.confirm(msg);
    };

    $scope.initialize = function() {
        if ($rootScope.loginSuccess === true) {
            $scope.today();

            $scope.getWorkingHours();
            $scope.getReservations();
        }
    };

    $scope.initialize();

}]);
