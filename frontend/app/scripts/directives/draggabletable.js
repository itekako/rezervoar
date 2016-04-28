'use strict';
angular.module('rezervoarApp')
    .directive('draggableTable', function() {
        return {
            restrict: 'A',
            scope: {
                onResize: '&onResize',
                onResizestop: '&onResizestop',
                onDragstop: '&onDragstop'
            },
            link: function postLink(scope, elem, attrs) {
                elem.resizable({handles: "n, e, s, w, ne, se, sw, nw"});
                elem.draggable({containment: "#drag-area"});

                elem.on('resize', function (evt, ui) {
                    scope.$apply(function() {
                        scope.onResize({$evt: evt, $ui: ui});
                    });
                });

                elem.on('resizestop', function (evt, ui) {
                    scope.$apply(function() {
                        scope.onResizestop({$evt: evt, $ui: ui});
                    });
                });

                elem.on('dragstop', function (evt, ui) {
                    scope.$apply(function() {
                        scope.onDragstop({$evt: evt, $ui: ui});
                    });
                });
            }
        };
    });
