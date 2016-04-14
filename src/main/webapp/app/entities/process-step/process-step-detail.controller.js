(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('ProcessStepDetailController', ProcessStepDetailController);

    ProcessStepDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'ProcessStep', 'PartFacet'];

    function ProcessStepDetailController($scope, $rootScope, $stateParams, entity, ProcessStep, PartFacet) {
        var vm = this;
        vm.processStep = entity;
        vm.load = function (id) {
            ProcessStep.get({id: id}, function(result) {
                vm.processStep = result;
            });
        };
        var unsubscribe = $rootScope.$on('mfgtoolingApp:processStepUpdate', function(event, result) {
            vm.processStep = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
