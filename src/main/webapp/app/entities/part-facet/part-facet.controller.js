(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('PartFacetController', PartFacetController);

    PartFacetController.$inject = ['$scope', '$state', 'PartFacet'];

    function PartFacetController ($scope, $state, PartFacet) {
        var vm = this;
        vm.partFacets = [];
        vm.loadAll = function() {
            PartFacet.query(function(result) {
                vm.partFacets = result;
            });
        };

        vm.loadAll();
        
    }
})();
