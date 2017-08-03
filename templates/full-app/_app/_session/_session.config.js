(function () {
    'use strict';
    angular.module('app.session')
        .config(configure);

    configure.$inject = ['$httpProvider', 'popupServiceProvider', 'SessionMessages'];

    function configure($httpProvider, popupServiceProvider, SessionMessages) {

        popupServiceProvider.addPopups(SessionMessages.popups, SessionMessages.namespace);

        $httpProvider.interceptors.push('AuthorizationInterceptor');
    }
})();
