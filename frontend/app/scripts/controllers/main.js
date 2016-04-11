'use strict';

/**
 * @ngdoc function
 * @name rezervoarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rezervoarApp
 */
angular.module('rezervoarApp')
  .controller('MainCtrl', ['$scope', 'GuestFactory', function ($scope, GuestFactory) {

    $scope.getGuest = function () {
        GuestFactory.getGuest(1).then(function (response) {
            console.log('response: ', JSON.stringify(response));
            console.log('data: ', JSON.stringify(response.data));
            $scope.guest = response.data;
        },
        function (response) {
            console.log('response: ', JSON.stringify(response));
        });
    };

    $scope.getGuest();

    $scope.dragStart = function(event) {
        var style = window.getComputedStyle(event.target, null);
        event.dataTransfer.setData('text/plain',
        (parseInt(style.getPropertyValue('left'),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue('top'),10) - event.clientY));
    };

    $scope.dragOver = function(event) {
        event.preventDefault();
        return false;
    };

    $scope.drop = function(event) {
        var offset = event.dataTransfer.getData('text/plain').split(',');
        var dm = document.getElementById('dragme');
        dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
        dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
        event.preventDefault();
        return false;
    };

    var dm = document.getElementById('dragme');
    dm.addEventListener('dragstart', $scope.dragStart, false);
    document.body.addEventListener('dragover', $scope.dragOver, false);
    document.body.addEventListener('drop', $scope.drop, false);
}]);
