(function () {
    'use strict';

    angular.module('modelMocks')
        .factory('<%=name=%>MockService', <%=name=%>MockService);

    <%=name=%>MockService.$inject = ['$filter', 'APIBase', 'mocksHelper', '<%=Name=%>'];

    function <%=name=%>MockService($filter, APIBase, mocksHelper, <%=Name=%>) {
        // Mocked data
        var mocks = [
            new <%=Name=%>({ id: 1, name: 'data1', group: 'group2' }),
            new <%=Name=%>({ id: 2, name: 'data2', group: 'group1' }),
            new <%=Name=%>({ id: 3, name: 'data3', group: 'group1' })
        ];
        var id = 4; // Next id

        var resources = {
            baseUri: '<%=name=%>', // <%=Name=%> base uri
            idName: 'id', // name of the unique property used as id
            IdRegExp: '(\\d+)', // RegExp to match ids from urls

            // Function used to parse url string id to id type; if undefined, transforms to Number
            parseId: parseStringToId
        };
        var mockUrlString = mocksHelper.regEsc(APIBase + resources.baseUri); // Escaped mock url for RegExp

        /* Mock method definition:
            name: {
                url: APIBase + baseUri + /(\d+)/, : if needed add regex for mock interceptor
                method: 'GET',                    : type of http call
                response: view<%=Name=%>            : function to respond with, mockHelper has defaults methods
            }
        */
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
            },
            // Custom endpoint implemented
            view: {
                url: new RegExp(mockUrlString + '/' + resources.IdRegExp + '/view'),
                method: 'GET',
                // Custom method implemented
                response: view<%=Name=%>
            }
        };
        methods.remove = angular.copy(methods.delete);

        resources.data = mocks;

        var service = {
            <%=name=%>s: resources,
            APIMethods: methods
        };

        return service;

        function view<%=Name=%>(method, url, data, headers) {
            return [200, resources.data, headers || { /* headers */ }];
        }

        /** Function to obtain next Id */
        function nextId() {
            return id++;
        }

        /** Function parse the string id obtained from an url to the id's type */
        function parseStringToId(stringId) {
            return Number(stringId);
        }
    }
})();