(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('ProcessesController', ProcessesController);

    ProcessesController.$inject = ['$scope', '$state', 'Processes'];

    function ProcessesController ($scope, $state, Processes) {
        var vm = this;
        vm.processes = [];
        vm.loadAll = function() {
            Processes.query(function(result) {
                vm.processes = result;
            });
        };

        vm.loadAll();
        
    }
})();
