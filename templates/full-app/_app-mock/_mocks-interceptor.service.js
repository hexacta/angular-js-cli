(function () {
    'use strict';
    angular.module('appMock')
        .factory('MocksInterceptor', MocksInterceptor);

    MocksInterceptor.$inject = ['$q', '$timeout', '$log', 'AppMockConfig'];

    function MocksInterceptor($q, $timeout, $log, AppMockConfig) {

        var MocksInterceptor = {
            request: request,
            response: response
        };

        return MocksInterceptor;

        function request(config) {
            $log.log('Requesting ' + config.url, config);

            return config;
        }

        function response(response) {
            var deferred = $q.defer();
            
            // Let through views immideately
            for (var i = 0; i < AppMockConfig.pathExceptions.length; i++) {
                if (response.config.url.indexOf(AppMockConfig.pathExceptions[i]) !== -1) {
                    return response;
                }
            }

            // Fake delay on response from APIs and other urls
            $log.log('Delaying response with ' + AppMockConfig.fakeDelay + 'ms');
            $timeout(function () {
                deferred.resolve(response);
            }, AppMockConfig.fakeDelay);

            return deferred.promise;
        }
    }
})();
