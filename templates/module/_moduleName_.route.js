(function () {
    'use strict';

    angular
        .module('<%=module=%>')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            // Add module states

            // Example of state without menu link
            {
                state: '<%=module=%>-simple-state',
                config: {
                    url: '/<%=module=%>-simple-state',
                    component: 'templateExample',
                    title: '<%=Name=%> Simple State'
                }
            },

            // Example of state with menu link
            {
                state: '<%=module=%>-menu-state',
                config: {
                    url: '/<%=module=%>-menu-state',
                    component: 'templateExample',
                    bindings: {}, // add component bindings that are resolved below

                    /** resolve bindings or parameter for the component. Ex:
                    *  resources: function (Resource) { return Resource.query() }*/
                    resolve: {},

                    title: '<%=Name=%> Menu State',
                    internalName: 'TemplateExample', // unique for menu items
                    settings: {
                        nav: 3, // menu position
                        icon: 'fa-exclamation-triangle' // menu icon
                    }
                }
            }
        ];
    }
})();
