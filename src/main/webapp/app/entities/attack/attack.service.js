(function() {
    'use strict';
    angular
        .module('mfgtoolingApp')
        .factory('Attack', Attack);

    Attack.$inject = ['$resource'];

    function Attack ($resource) {
        var resourceUrl =  'api/attacks/:id';

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
