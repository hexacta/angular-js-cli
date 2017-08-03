(function () {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    appRun.$inject = ['routerHelper', 'CoreConfig'];

    function appRun(routerHelper, CoreConfig) {
        var otherwise = CoreConfig.defaultState;
        routerHelper.configureStates(getStates(), otherwise);
    }

    function getStates() {
        return [
            {
                state: 'app',
                config: {
                    url: '/app',
                    abstract: true,
                    component: 'contentWrapper'
                }
            }
        ];
    }
})();
