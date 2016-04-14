(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('processes', {
            parent: 'entity',
            url: '/processes',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Processes'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/processes/processes.html',
                    controller: 'ProcessesController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('processes-detail', {
            parent: 'entity',
            url: '/processes/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Processes'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/processes/processes-detail.html',
                    controller: 'ProcessesDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Processes', function($stateParams, Processes) {
                    return Processes.get({id : $stateParams.id});
                }]
            }
        })
        .state('processes.new', {
            parent: 'processes',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/processes/processes-dialog.html',
                    controller: 'ProcessesDialogController',
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
                    $state.go('processes', null, { reload: true });
                }, function() {
                    $state.go('processes');
                });
            }]
        })
        .state('processes.edit', {
            parent: 'processes',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/processes/processes-dialog.html',
                    controller: 'ProcessesDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Processes', function(Processes) {
                            return Processes.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('processes', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('processes.delete', {
            parent: 'processes',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/processes/processes-delete-dialog.html',
                    controller: 'ProcessesDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Processes', function(Processes) {
                            return Processes.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('processes', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
