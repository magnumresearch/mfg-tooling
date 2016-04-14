(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('QualityControlStepDetailController', QualityControlStepDetailController);

    QualityControlStepDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'QualityControlStep', 'ProcessStep'];

    function QualityControlStepDetailController($scope, $rootScope, $stateParams, entity, QualityControlStep, ProcessStep) {
        var vm = this;
        vm.qualityControlStep = entity;
        vm.load = function (id) {
            QualityControlStep.get({id: id}, function(result) {
                vm.qualityControlStep = result;
            });
        };
        var unsubscribe = $rootScope.$on('mfgtoolingApp:qualityControlStepUpdate', function(event, result) {
            vm.qualityControlStep = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
