(function () {
    'use strict';
    angular.module('app.friends')
        .factory('groupsService', groupsService);

    groupsService.$inject = ['$state', 'Group'];

    function groupsService($state, Group) {

        var service = {
            get: get,
            getAll: getAll
        };

        return service;

        function get(id) {
            return Group.get({ id: id });
        }

        function getAll() {
            return Group.query();
        }
    }
})();
