(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('PartFacetDetailController', PartFacetDetailController);

    PartFacetDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'PartFacet', 'Part'];

    function PartFacetDetailController($scope, $rootScope, $stateParams, entity, PartFacet, Part) {
        var vm = this;
        vm.partFacet = entity;
        vm.load = function (id) {
            PartFacet.get({id: id}, function(result) {
                vm.partFacet = result;
            });
        };
        var unsubscribe = $rootScope.$on('mfgtoolingApp:partFacetUpdate', function(event, result) {
            vm.partFacet = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
