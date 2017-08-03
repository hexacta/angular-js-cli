(function () {
    'use strict';

    angular.module('modelMocks')
        .factory('friendMockService', friendMockService);

    friendMockService.$inject = ['$filter', 'APIBase', 'Friend', 'mocksHelper'];

    function friendMockService($filter, APIBase, Friend, mocksHelper) {
        var mocks = [
            new Friend({ id: 1, name: 'Jon Snow', group: 'Family' }),
            new Friend({ id: 2, name: 'Arya Stark', group: 'Club' }),
            new Friend({ id: 3, name: 'Cersei Lannister', group: 'Club' })
        ];
        var id = 4;

        var resources = {
            baseUri: 'friend',
            idName: 'id',
            IdRegExp: '(\\d+)',
            parseId: parseStringToId
        };
        var mockUrlString = mocksHelper.regEsc(APIBase + resources.baseUri);

        var methods = {
            get: {
                url: new RegExp(mockUrlString + '/' + resources.IdRegExp),
                method: 'GET',
                response: mocksHelper.defaultMethods.get.bind(null, resources)
            },
            save: {
                url: APIBase + resources.baseUri,
                method: 'POST',
                response: mocksHelper.defaultMethods.save.bind(null, resources, nextId())
            },
            query: {
                url: new RegExp(mockUrlString + mocksHelper.queryRegExp),
                method: 'GET',
                response: mocksHelper.defaultMethods.query.bind(null, resources)
            },
            delete: {
                url: new RegExp(mockUrlString + '/' + resources.IdRegExp),
                method: 'DELETE',
                response: mocksHelper.defaultMethods.remove.bind(null, resources)
            },
            update: {
                url: new RegExp(mockUrlString + '/' + resources.IdRegExp),
                method: 'PUT',
                response: mocksHelper.defaultMethods.update.bind(null, resources)
            }
        };
        methods.remove = angular.copy(methods.delete);

        resources.data = mocks;

        var service = {
            friends: resources,
            APIMethods: methods
        };

        return service;

        function nextId() {
            return id++;
        }

        function parseStringToId(stringId) {
            return Number(stringId);
        }
    }
})();
