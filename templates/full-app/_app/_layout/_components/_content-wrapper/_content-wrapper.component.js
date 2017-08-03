(function () {
    'use strict';
    angular.module('app.layout')
        .component('contentWrapper', {
            templateUrl: 'app/layout/components/content-wrapper/content-wrapper.template.html',
            controller: ContentWrapperCtrl
        });

    ContentWrapperCtrl.$inject = ['$window', '$state', 'sessionService'];

    function ContentWrapperCtrl($window, $state, sessionService) {
        var ctrl = this;

        ctrl.allowAccess = allowAccess;
        ctrl.getTitle = getTitle;
        ctrl.goBack = goBack;
        ctrl.logOut = logOut;
        ctrl.toggleSidebar = toggleSidebar;

        ctrl.$onInit = activate;

        function activate() {
            initToggle();
            ctrl.user = sessionService.getUserData();
            if (!sessionService.isLoggedIn()) {
                sessionService.handleTimeout(true);
            }
        }

        function allowAccess() {
            return ctrl.user && !hasRestrictedAccess();
        }

        function getTitle() {
            return $state.current.title;
        }

        function goBack() {
            $window.history.back();
        }

        function hasRestrictedAccess() {
            return ctrl.user.restrictedScreens &&
                ctrl.user.restrictedScreens.indexOf($state.current.internalName) !== -1;
        }

        function initToggle() {
            ctrl.toggle = sessionService.getSessionParam('toggleMenu');
            if (typeof (ctrl.toggle) === 'undefined') {
                ctrl.toggle = false;
                sessionService.setSessionParam('toggleMenu', false);
            }
        }

        function logOut() {
            sessionService.logOut();
        }

        function toggleSidebar() {
            ctrl.toggle = !ctrl.toggle;
            sessionService.setSessionParam('toggleMenu', ctrl.toggle);
        }
    }
})();
