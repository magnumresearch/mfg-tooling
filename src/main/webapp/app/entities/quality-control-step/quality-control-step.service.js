(function() {
    'use strict';
    angular
        .module('mfgtoolingApp')
        .factory('QualityControlStep', QualityControlStep);

    QualityControlStep.$inject = ['$resource'];

    function QualityControlStep ($resource) {
        var resourceUrl =  'api/quality-control-steps/:id';

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
