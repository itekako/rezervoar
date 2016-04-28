'use strict';
angular.module('rezervoarApp')
    .directive('draggableTable', function() {
        return {
            restrict: 'A',
            scope: {
                onResize: '&onResize',
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

                elem.on('dragstop', function (evt, ui) {
                    scope.$apply(function() {
                        console.log("iz dragstop: ");
                        console.log("evt: ", evt);
                        console.log("ui: ", ui);
                        scope.onDragstop({$evt: evt, $ui: ui});
                    });
                });
            }
        };
    });
