(function() {
    'use strict';
    angular
        .module('mfgtoolingApp')
        .factory('Part', Part);

    Part.$inject = ['$resource'];

    function Part ($resource) {
        var resourceUrl =  'api/parts/:id';

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
