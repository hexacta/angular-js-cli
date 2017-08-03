(function () {
    'use strict';

    var config = {
        appErrorPrefix: '[<%=title=%> Error] ',
        appTitle: '<%=title=%>'
    };

    angular.module('app.core')
        .config(configure);

    configure.$inject = [
        '$logProvider', '$httpProvider', 'routerHelperProvider', 'exceptionHandlerProvider',
        'popupServiceProvider', 'CoreMessages'
    ];

    function configure(
        $logProvider, $httpProvider, routerHelperProvider, exceptionHandlerProvider,
        popupServiceProvider, CoreMessages
    ) {

        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

        exceptionHandlerProvider.configure(config.appErrorPrefix);
        routerHelperProvider.configure({ docTitle: config.appTitle + ': ' });
        configureHttp($httpProvider);

        popupServiceProvider.addPopups(CoreMessages.popups, CoreMessages.namespace);
    }

    function configureHttp($httpProvider) {
        // initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Thu, 20 Feb 1986 05:00:00 GMT';
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get.Pragma = 'no-cache';

        $httpProvider.interceptors.push('HttpInterceptor');
    }

})();
