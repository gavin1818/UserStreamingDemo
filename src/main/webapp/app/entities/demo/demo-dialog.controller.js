(function() {
    'use strict';

    angular
        .module('omegaApp')
        .controller('DemoDialogController', DemoDialogController);

    DemoDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Demo'];

    function DemoDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Demo) {
        var vm = this;

        vm.demo = entity;
        vm.clear = clear;
        vm.save = save;

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.demo.id !== null) {
                Demo.update(vm.demo, onSaveSuccess, onSaveError);
            } else {
                Demo.save(vm.demo, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('omegaApp:demoUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
