(function() {
    'use strict';

    angular
        .module('omegaApp')
        .controller('DemoDeleteController',DemoDeleteController);

    DemoDeleteController.$inject = ['$uibModalInstance', 'entity', 'Demo'];

    function DemoDeleteController($uibModalInstance, entity, Demo) {
        var vm = this;

        vm.demo = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Demo.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
