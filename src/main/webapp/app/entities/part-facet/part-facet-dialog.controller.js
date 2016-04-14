(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('PartFacetDialogController', PartFacetDialogController);

    PartFacetDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'PartFacet', 'Part'];

    function PartFacetDialogController ($scope, $stateParams, $uibModalInstance, entity, PartFacet, Part) {
        var vm = this;
        vm.partFacet = entity;
        vm.parts = Part.query();
        vm.load = function(id) {
            PartFacet.get({id : id}, function(result) {
                vm.partFacet = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('mfgtoolingApp:partFacetUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.partFacet.id !== null) {
                PartFacet.update(vm.partFacet, onSaveSuccess, onSaveError);
            } else {
                PartFacet.save(vm.partFacet, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
