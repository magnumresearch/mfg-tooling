(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('ProcessesDetailController', ProcessesDetailController);

    ProcessesDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Processes', 'ProcessStep'];

    function ProcessesDetailController($scope, $rootScope, $stateParams, entity, Processes, ProcessStep) {
        var vm = this;
        vm.processes = entity;
        vm.load = function (id) {
            Processes.get({id: id}, function(result) {
                vm.processes = result;
            });
        };
        var unsubscribe = $rootScope.$on('mfgtoolingApp:processesUpdate', function(event, result) {
            vm.processes = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
