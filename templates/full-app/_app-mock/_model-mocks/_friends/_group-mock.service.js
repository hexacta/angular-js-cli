(function () {
    'use strict';

    angular.module('modelMocks')
        .factory('groupMockService', groupMockService);

    groupMockService.$inject = ['$filter', 'APIBase', 'Group', 'mocksHelper'];

    function groupMockService($filter, APIBase, Group, mocksHelper) {
        var mocks = [
            new Group({ id: 1, name: 'Family' }),
            new Group({ id: 2, name: 'Club' })
        ];

        var resources = {
            baseUri: 'group',
            idName: 'id',
            IdRegExp: '(\\d+)'
        };
        var mockUrlString = mocksHelper.regEsc(APIBase + resources.baseUri);

        var methods = {
            get: {
                url: new RegExp(mockUrlString + '/' + resources.IdRegExp),
                method: 'GET',
                response: mocksHelper.defaultMethods.get.bind(null, resources)
            },
            query: {
                url: APIBase + resources.baseUri,
                method: 'GET',
                response: mocksHelper.defaultMethods.query.bind(null, resources)
            }
        };

        resources.data = mocks;

        var service = {
            groups: resources,
            APIMethods: methods
        };

        return service;
    }
})();
