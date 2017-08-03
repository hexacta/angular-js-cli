(function () {
    'use strict';
    angular.module('<%=module=%>')
        .factory('<%=Name=%>Interceptor', <%=Name=%>Interceptor);

    <%=Name=%>Interceptor.$inject = ['$q'];

    function <%=Name=%>Interceptor($q) {

        var <%=name=%>Interceptor = {
            request: request,
            requestError: requestError,
            response: response,
            responseError: responseError
        };

        return <%=name=%>Interceptor;

        function request(config) {
            // TODO implement

            // For example:
            if (config.method === 'GET') {
                // Do something...
            }

            return config;
        }

        function requestError(config) {
            // TODO implement

            // For example:
            if (config.method === 'GET') {
                // Do something...
            }

            return config;
        }

        function response(res) {
            // TODO implement

            // For example:
            if (res.status === 200) {
                // Do something...
            }

            return $q.resolve(res);
        }

        function responseError(rejection) {
            // TODO implement

            // For example:
            if (rejection.status === 500) {
                // Do something...
            }

            return $q.reject(rejection);
        }
    }
})();
