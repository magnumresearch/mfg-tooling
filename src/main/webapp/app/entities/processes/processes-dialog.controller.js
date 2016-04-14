(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('ProcessesDialogController', ProcessesDialogController);

    ProcessesDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Processes', 'ProcessStep'];

    function ProcessesDialogController ($scope, $stateParams, $uibModalInstance, entity, Processes, ProcessStep) {
        var vm = this;
        vm.processes = entity;
        vm.processsteps = ProcessStep.query();
        vm.load = function(id) {
            Processes.get({id : id}, function(result) {
                vm.processes = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('mfgtoolingApp:processesUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.processes.id !== null) {
                Processes.update(vm.processes, onSaveSuccess, onSaveError);
            } else {
                Processes.save(vm.processes, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
