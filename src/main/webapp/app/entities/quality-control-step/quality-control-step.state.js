(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('quality-control-step', {
            parent: 'entity',
            url: '/quality-control-step',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'QualityControlSteps'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/quality-control-step/quality-control-steps.html',
                    controller: 'QualityControlStepController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('quality-control-step-detail', {
            parent: 'entity',
            url: '/quality-control-step/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'QualityControlStep'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/quality-control-step/quality-control-step-detail.html',
                    controller: 'QualityControlStepDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'QualityControlStep', function($stateParams, QualityControlStep) {
                    return QualityControlStep.get({id : $stateParams.id});
                }]
            }
        })
        .state('quality-control-step.new', {
            parent: 'quality-control-step',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/quality-control-step/quality-control-step-dialog.html',
                    controller: 'QualityControlStepDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                type: null,
                                feature: null,
                                customConstraint: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('quality-control-step', null, { reload: true });
                }, function() {
                    $state.go('quality-control-step');
                });
            }]
        })
        .state('quality-control-step.edit', {
            parent: 'quality-control-step',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/quality-control-step/quality-control-step-dialog.html',
                    controller: 'QualityControlStepDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['QualityControlStep', function(QualityControlStep) {
                            return QualityControlStep.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('quality-control-step', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('quality-control-step.delete', {
            parent: 'quality-control-step',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/quality-control-step/quality-control-step-delete-dialog.html',
                    controller: 'QualityControlStepDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['QualityControlStep', function(QualityControlStep) {
                            return QualityControlStep.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('quality-control-step', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
