(function() {
    'use strict';
    angular
        .module('omegaApp')
        .factory('Demo', Demo);

    Demo.$inject = ['$resource'];

    function Demo ($resource) {
        var resourceUrl =  'api/demos/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
