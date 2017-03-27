(function() {
    'use strict';

    angular
        .module('omegaApp')
        .controller('DemoDetailController', DemoDetailController);

    DemoDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Demo'];

    function DemoDetailController($scope, $rootScope, $stateParams, previousState, entity, Demo) {
        var vm = this;

        vm.demo = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('omegaApp:demoUpdate', function(event, result) {
            vm.demo = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
