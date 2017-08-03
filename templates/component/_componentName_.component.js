(function () {
    'use strict';
    angular.module('<%=module=%>')
        .component('<%=name=%>', {
            templateUrl: '<%=path-to=%>.template.html',
            controller: <%=Name=%>ComponentCtrl,
            bindings: {
                // Only use in and out bindings (&, <, @), avoid =
                aFunctionBinding: '&',
                anObjectBinding: '<?',
                aStringBinding: '@'
            }
        });

    // Dependencies, recomended alphabetical order
    // [...$angularDependencies, ...angularDependencies, ...externalPluginsDependencies, ...moduleDependencies]
    <%=Name=%>ComponentCtrl.$inject = ['<%=Module=%>Messages'];

    function <%=Name=%>ComponentCtrl(<%=Module=%>Messages) {
        var ctrl = this;

        // Controller local values here, sorted alphabetically
        var message = 'hello';

        // Controller out parameters, non-functions, sorted alphabetically
        ctrl.objectA = {};
        ctrl.objectB = 5;

        // Controller our parameters, functions, sorted alphabetically
        ctrl.myFunctionA = myFunctionA;
        ctrl.myFunctionB = myFunctionB;

        // component lifecycle bindings, sorted alphabetically
        ctrl.$onInit = activate;

        // declare functions, sorted alphabetically
        function activate() {
            ctrl.objectC = message + ' ' + <%=Module=%>Messages.namespace;
        }

        function myFunctionA() {
            ctrl.objectB = 'world';
        }

        function myFunctionB() {
            ctrl.objectB = 'World';
        }
    }
})();

