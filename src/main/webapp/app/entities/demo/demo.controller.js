(function() {
    'use strict';

    angular
        .module('omegaApp')
        .controller('DemoController', DemoController);

    DemoController.$inject = ['Demo'];

    function DemoController(Demo) {

        var vm = this;

        vm.demos = [];

        loadAll();

        function loadAll() {
            Demo.query(function(result) {
                vm.demos = result;
                vm.searchQuery = null;
            });
        }
    }
})();
