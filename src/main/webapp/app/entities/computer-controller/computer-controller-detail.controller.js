(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('ComputerControllerDetailController', ComputerControllerDetailController);

    ComputerControllerDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'ComputerController', 'ProcessStep'];

    function ComputerControllerDetailController($scope, $rootScope, $stateParams, entity, ComputerController, ProcessStep) {
        var vm = this;
        vm.computerController = entity;
        vm.load = function (id) {
            ComputerController.get({id: id}, function(result) {
                vm.computerController = result;
            });
        };
        var unsubscribe = $rootScope.$on('mfgtoolingApp:computerControllerUpdate', function(event, result) {
            vm.computerController = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
