(function () {
    'use strict';
    angular.module('app.layout')
        .component('sidemenu', {
            templateUrl: 'app/layout/components/sidemenu/sidemenu.template.html',
            controller: SidemenuCtrl,
            bindings: {
                logout: '&',
                restrictedScreens: '<',
                toggleSidebar: '&'
            }
        });

    SidemenuCtrl.$inject = ['$state', 'routerHelper', 'CoreConfig'];
    function SidemenuCtrl($state, routerHelper, CoreConfig) {
        var ctrl = this;

        ctrl.hasRestrictedAccess = hasRestrictedAccess;
        ctrl.isCurrent = isCurrent;

        ctrl.$onInit = activate;

        function activate() {
            ctrl.appTitle = CoreConfig.appTitle;
            getNavRoutes();
        }

        function getNavRoutes() {
            ctrl.navRoutes = routerHelper.getStates()
                .filter(function (state) {
                    return state.settings && state.settings.nav;
                })
                .sort(function (state1, state2) {
                    return state1.settings.nav - state2.settings.nav;
                });
        }

        function hasRestrictedAccess(navItem) {
            return ctrl.restrictedScreens && ctrl.restrictedScreens.indexOf(navItem.internalName) !== -1;
        }

        function isCurrent(route) {
            if (!route.title || !$state.current || !$state.current.title) {
                return '';
            }

            return $state.current.internalName === route.internalName;
        }
    }
})();
