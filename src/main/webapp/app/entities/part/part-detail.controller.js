(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('PartDetailController', PartDetailController);

    PartDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Part'];

    function PartDetailController($scope, $rootScope, $stateParams, entity, Part) {
        var vm = this;
        vm.part = entity;
        vm.load = function (id) {
            Part.get({id: id}, function(result) {
                vm.part = result;
            });
        };
        var unsubscribe = $rootScope.$on('mfgtoolingApp:partUpdate', function(event, result) {
            vm.part = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
