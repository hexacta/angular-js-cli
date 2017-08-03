(function () {
    'use strict';

    angular
            .module('common')
            .factory('reservedResourcesService', reservedResourcesService);

    reservedResourcesService.$inject = ['$q', '$window'];

    function reservedResourcesService($q, $window) {
        var callbacks = [];

        angular.element($window).on('beforeunload', clear);

        var service = {
            add: add,
            clear: clear
        };

        return service;

        function add(callback) {
            callbacks.push(callback);
        }

        function clear() {
            var promises = callbacks.map(function (callback) {
                return callback();
            });

            return $q.all(promises);
        }

    }
})();
