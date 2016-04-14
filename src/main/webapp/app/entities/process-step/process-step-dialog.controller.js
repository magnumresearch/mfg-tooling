(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('ProcessStepDialogController', ProcessStepDialogController);

    ProcessStepDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', '$q', 'entity', 'ProcessStep', 'PartFacet'];

    function ProcessStepDialogController ($scope, $stateParams, $uibModalInstance, $q, entity, ProcessStep, PartFacet) {
        var vm = this;
        vm.processStep = entity;
        vm.followings = ProcessStep.query({filter: 'processstep-is-null'});
        $q.all([vm.processStep.$promise, vm.followings.$promise]).then(function() {
            if (!vm.processStep.following || !vm.processStep.following.id) {
                return $q.reject();
            }
            return ProcessStep.get({id : vm.processStep.following.id}).$promise;
        }).then(function(following) {
            vm.followings.push(following);
        });
        vm.partfacets = PartFacet.query();
        vm.load = function(id) {
            ProcessStep.get({id : id}, function(result) {
                vm.processStep = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('mfgtoolingApp:processStepUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.processStep.id !== null) {
                ProcessStep.update(vm.processStep, onSaveSuccess, onSaveError);
            } else {
                ProcessStep.save(vm.processStep, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
