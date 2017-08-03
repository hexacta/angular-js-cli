(function () {
    'use strict';

    angular.module('appMock')
        .config(configure);

    configure.$inject = ['$httpProvider'];

    function configure($httpProvider) {
        $httpProvider.interceptors.push('MocksInterceptor');
    }
})();
