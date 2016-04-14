(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('ProcessStepController', ProcessStepController);

    ProcessStepController.$inject = ['$scope', '$state', 'ProcessStep'];

    function ProcessStepController ($scope, $state, ProcessStep) {
        var vm = this;
        vm.processSteps = [];
        vm.loadAll = function() {
            ProcessStep.query(function(result) {
                vm.processSteps = result;
            });
        };

        vm.loadAll();
        
    }
})();
