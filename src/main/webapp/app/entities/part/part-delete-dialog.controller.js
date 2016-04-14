(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('PartDeleteController',PartDeleteController);

    PartDeleteController.$inject = ['$uibModalInstance', 'entity', 'Part'];

    function PartDeleteController($uibModalInstance, entity, Part) {
        var vm = this;
        vm.part = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Part.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
