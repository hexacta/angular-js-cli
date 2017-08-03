(function () {
    'use strict';
    angular.module('<%=module=%>')
        .config(configure);

    configure.$inject = ['$httpProvider', 'popupServiceProvider', '<%=Name=%>Messages'];

    function configure($httpProvider, popupServiceProvider, <%=Name=%>Messages) {
        // TODO implement

        // Load popups on popupService
        popupServiceProvider.addPopups(<%=Name=%>Messages.popups, <%=Name=%>Messages.namespace);

        // For example add module's interceptors
        // $httpProvider.interceptors.push('HttpInterceptor');
    }
})();