(function() {
    'use strict';
    angular
        .module('mfgtoolingApp')
        .factory('ProcessStep', ProcessStep);

    ProcessStep.$inject = ['$resource'];

    function ProcessStep ($resource) {
        var resourceUrl =  'api/process-steps/:id';

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
