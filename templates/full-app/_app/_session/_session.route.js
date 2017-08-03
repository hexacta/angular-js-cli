(function () {
    'use strict';

    angular
        .module('app.session')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'login',
                config: {
                    url: '/login',
                    template: '<login></login>',
                    title: 'Login'
                }
            },
            {
                state: 'change-password',
                config: {
                    url: '/change-password',
                    template: '<change-password></change-password>',
                    title: 'Change Password'
                }
            }
        ];
    }
})();
