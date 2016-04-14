(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('AttackDialogController', AttackDialogController);

    AttackDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Attack', 'ProcessStep'];

    function AttackDialogController ($scope, $stateParams, $uibModalInstance, entity, Attack, ProcessStep) {
        var vm = this;
        vm.attack = entity;
        vm.processsteps = ProcessStep.query();
        vm.load = function(id) {
            Attack.get({id : id}, function(result) {
                vm.attack = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('mfgtoolingApp:attackUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.attack.id !== null) {
                Attack.update(vm.attack, onSaveSuccess, onSaveError);
            } else {
                Attack.save(vm.attack, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
