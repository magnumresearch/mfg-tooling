(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('part-facet', {
            parent: 'entity',
            url: '/part-facet',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'PartFacets'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/part-facet/part-facets.html',
                    controller: 'PartFacetController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('part-facet-detail', {
            parent: 'entity',
            url: '/part-facet/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'PartFacet'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/part-facet/part-facet-detail.html',
                    controller: 'PartFacetDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'PartFacet', function($stateParams, PartFacet) {
                    return PartFacet.get({id : $stateParams.id});
                }]
            }
        })
        .state('part-facet.new', {
            parent: 'part-facet',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/part-facet/part-facet-dialog.html',
                    controller: 'PartFacetDialogController',
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
                    $state.go('part-facet', null, { reload: true });
                }, function() {
                    $state.go('part-facet');
                });
            }]
        })
        .state('part-facet.edit', {
            parent: 'part-facet',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/part-facet/part-facet-dialog.html',
                    controller: 'PartFacetDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['PartFacet', function(PartFacet) {
                            return PartFacet.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('part-facet', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('part-facet.delete', {
            parent: 'part-facet',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/part-facet/part-facet-delete-dialog.html',
                    controller: 'PartFacetDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['PartFacet', function(PartFacet) {
                            return PartFacet.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('part-facet', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
