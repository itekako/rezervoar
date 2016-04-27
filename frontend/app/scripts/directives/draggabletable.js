'use strict';
angular.module('rezervoarApp')
    .directive('draggableTable', function() {
        return {
            restrict: 'A',
            scope: {
                callback: '&onResize'
            },
            link: function postLink(scope, elem, attrs) {
                elem.resizable({handles: "n, e, s, w, ne, se, sw, nw"});
                elem.draggable({containment: "#drag-area"});

                elem.on('resize', function (evt, ui) {
                    scope.$apply(function() {
                        if (scope.callback) {
                            scope.callback({$evt: evt, $ui: ui });
                        }
                    });
                });
            }
        };
    });
