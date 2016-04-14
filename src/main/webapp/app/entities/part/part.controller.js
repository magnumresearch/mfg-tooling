(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('PartController', PartController);

    PartController.$inject = ['$scope', '$state', 'Part'];

    function PartController ($scope, $state, Part) {
        var vm = this;
        vm.parts = [];
        vm.loadAll = function() {
            Part.query(function(result) {
                vm.parts = result;
            });
        };

        vm.loadAll();
        
    }
})();
