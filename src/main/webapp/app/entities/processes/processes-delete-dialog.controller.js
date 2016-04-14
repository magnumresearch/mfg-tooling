(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('ProcessesDeleteController',ProcessesDeleteController);

    ProcessesDeleteController.$inject = ['$uibModalInstance', 'entity', 'Processes'];

    function ProcessesDeleteController($uibModalInstance, entity, Processes) {
        var vm = this;
        vm.processes = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Processes.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
