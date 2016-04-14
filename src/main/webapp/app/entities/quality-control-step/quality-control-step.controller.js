(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('QualityControlStepController', QualityControlStepController);

    QualityControlStepController.$inject = ['$scope', '$state', 'QualityControlStep'];

    function QualityControlStepController ($scope, $state, QualityControlStep) {
        var vm = this;
        vm.qualityControlSteps = [];
        vm.loadAll = function() {
            QualityControlStep.query(function(result) {
                vm.qualityControlSteps = result;
            });
        };

        vm.loadAll();
        
    }
})();
