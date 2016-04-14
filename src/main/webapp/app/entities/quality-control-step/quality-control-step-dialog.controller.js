(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('QualityControlStepDialogController', QualityControlStepDialogController);

    QualityControlStepDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'QualityControlStep', 'ProcessStep'];

    function QualityControlStepDialogController ($scope, $stateParams, $uibModalInstance, entity, QualityControlStep, ProcessStep) {
        var vm = this;
        vm.qualityControlStep = entity;
        vm.processsteps = ProcessStep.query();
        vm.load = function(id) {
            QualityControlStep.get({id : id}, function(result) {
                vm.qualityControlStep = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('mfgtoolingApp:qualityControlStepUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.qualityControlStep.id !== null) {
                QualityControlStep.update(vm.qualityControlStep, onSaveSuccess, onSaveError);
            } else {
                QualityControlStep.save(vm.qualityControlStep, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
