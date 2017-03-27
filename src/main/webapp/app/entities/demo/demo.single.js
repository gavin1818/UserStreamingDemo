/**
 * Created by Gavinhehe on 2017-03-25.
 */
(function () {
    'use strict';
    angular
        .module('omegaApp')
        .controller('DemoSingleController', DemoSingleController);

    DemoSingleController.$inject = ['$scope', '$http', '$timeout', "$firebaseArray"];

    function DemoSingleController($scope, $http, $timeout, $firebaseArray) {
        $scope.items = $firebaseArray(firebase.database().ref("items"));
        $scope.item = {};

        $scope.submit = function() {
            if ($scope.item) {
                $scope.items.$add($scope.item);
            }
        };


    };
})();

