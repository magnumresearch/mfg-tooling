(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .controller('AttackDetailController', AttackDetailController);

    AttackDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Attack', 'ProcessStep'];

    function AttackDetailController($scope, $rootScope, $stateParams, entity, Attack, ProcessStep) {
        var vm = this;
        vm.attack = entity;
        vm.load = function (id) {
            Attack.get({id: id}, function(result) {
                vm.attack = result;
            });
        };
        var unsubscribe = $rootScope.$on('mfgtoolingApp:attackUpdate', function(event, result) {
            vm.attack = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
