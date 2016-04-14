
(function() {
    'use strict';

    angular
        .module('mfgtoolingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('dashboard', {
            parent: 'app',
            url: '/dashboard',
            data: {
                authorities: []
            },
            views: {
                'content@': {
                    templateUrl: 'app/dashboard/dashboard.html',
                    // controller: 'DashboardController',
                    // controllerAs: 'vm'
                }
            }
        });
    }
})();