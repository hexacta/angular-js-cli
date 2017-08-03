(function () {
    'use strict';
    angular.module('app.layout')
            .component('navHeader', {
                templateUrl: 'app/layout/components/nav-header/nav-header.template.html',
                bindings: {
                    logout: '&',
                    goBack: '&',
                    title: '@screenTitle',
                    user: '<'
                }
            });
})();
