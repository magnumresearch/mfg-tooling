(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('AttackController', AttackController);

    AttackController.$inject = ['$scope', '$state', 'Attack'];

    function AttackController ($scope, $state, Attack) {
        var vm = this;
        vm.attacks = [];
        vm.loadAll = function() {
            Attack.query(function(result) {
                vm.attacks = result;
            });
        };

        vm.loadAll();
        
    }
})();
