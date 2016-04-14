(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('PartFacetDeleteController',PartFacetDeleteController);

    PartFacetDeleteController.$inject = ['$uibModalInstance', 'entity', 'PartFacet'];

    function PartFacetDeleteController($uibModalInstance, entity, PartFacet) {
        var vm = this;
        vm.partFacet = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            PartFacet.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
