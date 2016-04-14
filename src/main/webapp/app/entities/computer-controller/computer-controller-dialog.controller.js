(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('ComputerControllerDialogController', ComputerControllerDialogController);

    ComputerControllerDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'ComputerController', 'ProcessStep'];

    function ComputerControllerDialogController ($scope, $stateParams, $uibModalInstance, entity, ComputerController, ProcessStep) {
        var vm = this;
        vm.computerController = entity;
        vm.processsteps = ProcessStep.query();
        vm.load = function(id) {
            ComputerController.get({id : id}, function(result) {
                vm.computerController = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('mfgtoolingApp:computerControllerUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.computerController.id !== null) {
                ComputerController.update(vm.computerController, onSaveSuccess, onSaveError);
            } else {
                ComputerController.save(vm.computerController, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
