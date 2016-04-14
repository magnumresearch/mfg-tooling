(function() {
    'use strict';
    angular
        .module('mfgtoolingApp')
        .factory('ComputerController', ComputerController);

    ComputerController.$inject = ['$resource'];

    function ComputerController ($resource) {
        var resourceUrl =  'api/computer-controllers/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
