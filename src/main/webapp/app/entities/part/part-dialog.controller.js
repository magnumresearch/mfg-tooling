(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('PartDialogController', PartDialogController);

    PartDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Part'];

    function PartDialogController ($scope, $stateParams, $uibModalInstance, entity, Part) {
        var vm = this;
        vm.part = entity;
        vm.load = function(id) {
            Part.get({id : id}, function(result) {
                vm.part = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('mfgtoolingApp:partUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.part.id !== null) {
                Part.update(vm.part, onSaveSuccess, onSaveError);
            } else {
                Part.save(vm.part, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
