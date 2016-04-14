(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('QualityControlStepDeleteController',QualityControlStepDeleteController);

    QualityControlStepDeleteController.$inject = ['$uibModalInstance', 'entity', 'QualityControlStep'];

    function QualityControlStepDeleteController($uibModalInstance, entity, QualityControlStep) {
        var vm = this;
        vm.qualityControlStep = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            QualityControlStep.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
