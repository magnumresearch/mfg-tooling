(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('ComputerControllerController', ComputerControllerController);

    ComputerControllerController.$inject = ['$scope', '$state', 'ComputerController'];

    function ComputerControllerController ($scope, $state, ComputerController) {
        var vm = this;
        vm.computerControllers = [];
        vm.loadAll = function() {
            ComputerController.query(function(result) {
                vm.computerControllers = result;
            });
        };

        vm.loadAll();
        
    }
})();
