/*
    Service used to create a $resource
    - Avoids using $http
    - Easy configuration
    - Can define the api and configure custom calls
*/
(function () {
    'use strict';

    angular.module('<%=module=%>')
        .factory('<%=Name=%>', <%=Name=%>);

    <%=Name=%>.$inject = ['$resource', 'APIBase'];

    function <%=Name=%>($resource, APIBase) {
        var baseUri = '<%=name=%>'; // <%=Name=%> base uri
        var idParam = '/:id'; // <%=Name=%> uri id identifier

        // $resource predefined methods are get, save, query, remove, delete (can be overriden)
        var methods = {
            update: { method: 'PUT' },

            // Custom endpoint implemented
            view: {
                url: APIBase + baseUri + idParam + '/view',
                method: 'GET',
                transformResponse: transformView
            }
        };

        // creates a $resource with the defined methods
        var <%=Name=%> = $resource(APIBase + baseUri + idParam, { id: '@id' }, angular.copy(methods));

        // In this block, calculated properties for the prototype <%=Name=%> can be added
        angular.extend(<%=Name=%>.prototype, { getSummary: getSummary });

        return <%=Name=%>;

        function getSummary() {
            return 'Summary: ' + this.name + ' - ' + this.group;
        }

        function transformView(data) {
            var <%=name=%> = angular.fromJson(data);
            if (<%=name=%> instanceof <%=Name=%>) {
                <%=name=%>.name = <%=name=%>.name.toUpperCase();
            }

            return <%=name=%>;
        }
    }
})();