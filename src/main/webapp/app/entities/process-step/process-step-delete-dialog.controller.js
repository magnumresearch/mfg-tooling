(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('ProcessStepDeleteController',ProcessStepDeleteController);

    ProcessStepDeleteController.$inject = ['$uibModalInstance', 'entity', 'ProcessStep'];

    function ProcessStepDeleteController($uibModalInstance, entity, ProcessStep) {
        var vm = this;
        vm.processStep = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            ProcessStep.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
