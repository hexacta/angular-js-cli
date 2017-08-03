(function () {
    'use strict';
    angular.module('app.core')
        .factory('HttpInterceptor', HttpInterceptor);

    HttpInterceptor.$inject = ['$q', '$injector'];

    function HttpInterceptor($q, $injector) {
        var errorsNamespace = 'core';
        var httpInterceptor = { responseError: responseError };

        return httpInterceptor;

        function responseError(rejection) {
            if (rejection.status === 500) {
                getErrorPopup(rejection);
            }

            return $q.reject(rejection);
        }

        function getErrorPopup(error) {
            var popupService = $injector.get('popupService');
            if (!error.data || !error.data.message) {
                return popupService.getPopup(errorsNamespace + '.generalError');
            } else if (error.data.id) {
                return popupService.getPopup(errorsNamespace + '.' + error.data.message, null, [error.data.id]);
            }

            return popupService.getPopup(errorsNamespace + '.' + error.data.message);

        }
    }
})();
