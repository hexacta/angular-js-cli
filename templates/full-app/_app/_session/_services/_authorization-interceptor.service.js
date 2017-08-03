(function () {
    'use strict';
    angular.module('app.session')
        .factory('AuthorizationInterceptor', AuthorizationInterceptor);

    AuthorizationInterceptor.$inject = ['$q', '$injector'];

    function AuthorizationInterceptor($q, $injector) {

        var AuthorizationInterceptor = {
            responseError: responseError,
            request: request
        };

        return AuthorizationInterceptor;

        function responseError(rejection) {
            if (rejection.status === 401) {
                var sessionService = $injector.get('sessionService');

                return sessionService.handleTimeout(rejection);
            }

            return $q.reject(rejection);
        }

        function request(config) {
            if (config.method === 'GET' && (!config.cache || !config.cache.get(config.url))) {
                var sessionService = $injector.get('sessionService');
                if (sessionService.isLoggedIn()) {
                    sessionService.refreshTimer();
                }
            }

            return config;
        }
    }
})();
