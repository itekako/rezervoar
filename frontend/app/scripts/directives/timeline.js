'use strict';

angular.module('rezervoarApp')
    .directive('timeLine', function() {
    return {
        restrict: 'E',
        scope: {
            startTime: '=',
            endTime: '=',
            takenIntervals: '=',
            takenPercent: '@',
            takenStart: '@'
        },
        template: '<span data-ng-repeat="inter in intervals" class="time-line-span" title={{inter.title}} style="width:{{inter.takenPixels}}px;left:{{inter.takenStart}}px;"></span>',
        link: function(scope, element, attr) {
            element.addClass('time-line');

            // duzina vremenske linije u px
            var width = 50;

            scope.makeTimeLine = function () {
                var startTimeArray = scope.startTime.split(':');
                var endTimeArray = scope.endTime.split(':');

                // vreme na slajder - 30 min
                var sliderStartMinutes = parseInt(startTimeArray[0], 10) * 60 + parseInt(startTimeArray[1], 10) - 30;
                // vreme na slajder + 30 min
                var sliderEndMinutes = parseInt(endTimeArray[0], 10) * 60 + parseInt(endTimeArray[1], 10) + 30;

                // opseg u minutima
                var range = sliderEndMinutes - sliderStartMinutes;

                scope.intervals = [];

                for (var i in scope.takenIntervals) {
                    // od kada je i-ti sto zauzet
                    var takenFrom = scope.takenIntervals[i].startDate.split(' ')[1].split(':');
                    // do kada je i-ti sto zauzet
                    var takenTo = scope.takenIntervals[i].endDate.split(' ')[1].split(':');

                    // pocetak intervala zauzetosti stola
                    var takenFromMinutes = parseInt(takenFrom[0], 10) * 60 + parseInt(takenFrom[1], 10);
                    if (takenFromMinutes < sliderStartMinutes) {
                        takenFromMinutes = sliderStartMinutes;
                    }
                    // kraj intervala zauzetosti stola
                    var takenToMinutes = parseInt(takenTo[0], 10) * 60 + parseInt(takenTo[1], 10);
                    if (takenToMinutes > sliderEndMinutes) {
                        takenToMinutes = sliderEndMinutes;
                    }

                    // procenat zauzetosti stola u odnosu na interval zadat na slajder +/- 30 min
                    scope.takenPercent = (takenToMinutes - takenFromMinutes) * 100 / range;

                    // odakle pocinje interval u odnosu na vremensku liniju u procentima
                    var startFromPercent = (takenFromMinutes - sliderStartMinutes) * 100 / range;

                    // odakle pocinje interval, u px, u odnosu na levu ivicu vremenske linije
                    scope.takenStart = startFromPercent * width / 100;

                    // duzina zauzetog intervala u px
                    scope.takenPixels = (scope.takenPercent * width) / 100;

                    scope.intervals.push({
                        takenPixels: scope.takenPixels,
                        takenStart: scope.takenStart,
                        title: scope.takenIntervals[i].startDate.split(' ')[1] + ' - ' + scope.takenIntervals[i].endDate.split(' ')[1]
                    });
                } // for
            }; //scope.makeTimeLine

            scope.$on('scaleIntervals', function(event, data){
                if (element[0].id === data.id.replace('div', 'timeline')) {
                    width = data.width;
                    scope.makeTimeLine();
                }
            }); // on_broadcast

            scope.makeTimeLine();
        } // link
    }; // return
    });
