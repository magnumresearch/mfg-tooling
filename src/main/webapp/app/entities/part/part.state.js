(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('part', {
            parent: 'entity',
            url: '/part',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Parts'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/part/parts.html',
                    controller: 'PartController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('part-detail', {
            parent: 'entity',
            url: '/part/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Part'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/part/part-detail.html',
                    controller: 'PartDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Part', function($stateParams, Part) {
                    return Part.get({id : $stateParams.id});
                }]
            }
        })
        .state('part.new', {
            parent: 'part',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/part/part-dialog.html',
                    controller: 'PartDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('part', null, { reload: true });
                }, function() {
                    $state.go('part');
                });
            }]
        })
        .state('part.edit', {
            parent: 'part',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/part/part-dialog.html',
                    controller: 'PartDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Part', function(Part) {
                            return Part.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('part', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('part.delete', {
            parent: 'part',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/part/part-delete-dialog.html',
                    controller: 'PartDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Part', function(Part) {
                            return Part.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('part', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
