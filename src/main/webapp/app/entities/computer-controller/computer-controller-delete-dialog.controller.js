(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('ComputerControllerDeleteController',ComputerControllerDeleteController);

    ComputerControllerDeleteController.$inject = ['$uibModalInstance', 'entity', 'ComputerController'];

    function ComputerControllerDeleteController($uibModalInstance, entity, ComputerController) {
        var vm = this;
        vm.computerController = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            ComputerController.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
