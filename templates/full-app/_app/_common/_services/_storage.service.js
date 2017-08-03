(function () {
    'use strict';
    // eslint-disable-next-line custom-file-names
    angular.module('common')
        .value('$localStorage', localStorage);

    angular
        .module('common')
        .factory('storageService', storageService);

    storageService.$inject = ['$localStorage'];

    function storageService($localStorage) {

        var service = {
            clear: clear,
            exists: exists,
            load: load,
            save: save
        };

        return service;

        function clear(item) {
            $localStorage.removeItem(item);
        }

        function exists(item) {
            return $localStorage.getItem(item) !== null;
        }

        function load(item) {
            return JSON.parse($localStorage.getItem(item));
        }

        function save(item, data) {
            $localStorage.setItem(item, JSON.stringify(data));
        }

    }
})();
