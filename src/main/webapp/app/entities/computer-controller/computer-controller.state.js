(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('computer-controller', {
            parent: 'entity',
            url: '/computer-controller',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'ComputerControllers'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/computer-controller/computer-controllers.html',
                    controller: 'ComputerControllerController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('computer-controller-detail', {
            parent: 'entity',
            url: '/computer-controller/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'ComputerController'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/computer-controller/computer-controller-detail.html',
                    controller: 'ComputerControllerDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'ComputerController', function($stateParams, ComputerController) {
                    return ComputerController.get({id : $stateParams.id});
                }]
            }
        })
        .state('computer-controller.new', {
            parent: 'computer-controller',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/computer-controller/computer-controller-dialog.html',
                    controller: 'ComputerControllerDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                operatingSystem: null,
                                operatingSoftware: null,
                                network: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('computer-controller', null, { reload: true });
                }, function() {
                    $state.go('computer-controller');
                });
            }]
        })
        .state('computer-controller.edit', {
            parent: 'computer-controller',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/computer-controller/computer-controller-dialog.html',
                    controller: 'ComputerControllerDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['ComputerController', function(ComputerController) {
                            return ComputerController.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('computer-controller', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('computer-controller.delete', {
            parent: 'computer-controller',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/computer-controller/computer-controller-delete-dialog.html',
                    controller: 'ComputerControllerDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['ComputerController', function(ComputerController) {
                            return ComputerController.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('computer-controller', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
