(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('AttackDeleteController',AttackDeleteController);

    AttackDeleteController.$inject = ['$uibModalInstance', 'entity', 'Attack'];

    function AttackDeleteController($uibModalInstance, entity, Attack) {
        var vm = this;
        vm.attack = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Attack.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
