(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('attack', {
            parent: 'entity',
            url: '/attack',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Attacks'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/attack/attacks.html',
                    controller: 'AttackController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('attack-detail', {
            parent: 'entity',
            url: '/attack/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Attack'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/attack/attack-detail.html',
                    controller: 'AttackDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Attack', function($stateParams, Attack) {
                    return Attack.get({id : $stateParams.id});
                }]
            }
        })
        .state('attack.new', {
            parent: 'attack',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/attack/attack-dialog.html',
                    controller: 'AttackDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                type: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('attack', null, { reload: true });
                }, function() {
                    $state.go('attack');
                });
            }]
        })
        .state('attack.edit', {
            parent: 'attack',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/attack/attack-dialog.html',
                    controller: 'AttackDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Attack', function(Attack) {
                            return Attack.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('attack', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('attack.delete', {
            parent: 'attack',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/attack/attack-delete-dialog.html',
                    controller: 'AttackDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Attack', function(Attack) {
                            return Attack.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('attack', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
