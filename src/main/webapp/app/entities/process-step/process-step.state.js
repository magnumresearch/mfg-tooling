(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('process-step', {
            parent: 'entity',
            url: '/process-step',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'ProcessSteps'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/process-step/process-steps.html',
                    controller: 'ProcessStepController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('process-step-detail', {
            parent: 'entity',
            url: '/process-step/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'ProcessStep'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/process-step/process-step-detail.html',
                    controller: 'ProcessStepDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'ProcessStep', function($stateParams, ProcessStep) {
                    return ProcessStep.get({id : $stateParams.id});
                }]
            }
        })
        .state('process-step.new', {
            parent: 'process-step',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/process-step/process-step-dialog.html',
                    controller: 'ProcessStepDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                type: null,
                                name: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('process-step', null, { reload: true });
                }, function() {
                    $state.go('process-step');
                });
            }]
        })
        .state('process-step.edit', {
            parent: 'process-step',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/process-step/process-step-dialog.html',
                    controller: 'ProcessStepDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['ProcessStep', function(ProcessStep) {
                            return ProcessStep.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('process-step', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('process-step.delete', {
            parent: 'process-step',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/process-step/process-step-delete-dialog.html',
                    controller: 'ProcessStepDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['ProcessStep', function(ProcessStep) {
                            return ProcessStep.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('process-step', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
