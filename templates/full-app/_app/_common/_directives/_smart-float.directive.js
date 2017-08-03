// (function () {
//     'use strict';
//     angular
//         .module('common')
//         .directive('smartFloat', smartFloat);

//     smartFloat.$inject = ['$filter'];

//     function smartFloat($filter) {

//         return {
//             restrict: 'A',
//             require: 'ngModel',
//             scope: { smartFloat: '<?' }, // expects a regex to test, default /^\d+(\.(\d{1,2})?)?$/
//             link: smartFloatLink
//         };

//         function smartFloatLink(scope, elm, attrs, controller) {
//             if (attrs.type === 'number') {
//                 var regex = scope.smartFloat || /^\d+(\.(\d{1,2})?)?$/;
//                 controller.$parsers.unshift(function (viewValue) {
//                     if (regex.test(viewValue)) {
//                         controller.$setValidity('float', true);

//                         return parseFloat(viewValue);
//                     }
//                     controller.$setValidity('float', false);

//                     return undefined;
//                 });
//                 controller.$formatters.unshift(
//                     function (modelValue) {
//                         return $filter('number')(parseFloat(modelValue), 2);
//                     }
//                 );
//             }
//         }
//     }
// })();

(function () {
    'use strict';
    angular
        .module('common')
        .directive('smartFloat', smartFloat);

    smartFloat.$inject = [];

    function smartFloat() {

        return {
            restrict: 'A',
            require: { ngModelCtrl: 'ngModel' },
            scope: {},
            controller: smartFloatCtrl,
            controllerAs: '$ctrl',
            bindToController: { smartFloat: '<?', type: '@' } // expects a regex to test, default /^\d+(\.(\d{1,2})?)?$/
        };
    }

    smartFloatCtrl.$inject = ['$filter'];
    function smartFloatCtrl($filter) {
        var ctrl = this;

        ctrl.$onInit = addParser;

        function addParser() {
            if (ctrl.type === 'number') {
                var regex = ctrl.smartFloat || /^\d+(\.(\d{1,2})?)?$/;
                ctrl.ngModelCtrl.$parsers.unshift(function (viewValue) {
                    if (regex.test(viewValue)) {
                        ctrl.ngModelCtrl.$setValidity('float', true);

                        return parseFloat(viewValue);
                    }
                    ctrl.ngModelCtrl.$setValidity('float', false);

                    return undefined;
                });
                ctrl.ngModelCtrl.$formatters.unshift(
                    function (modelValue) {
                        return $filter('number')(parseFloat(modelValue), 2);
                    }
                );
            }
        }
    }
})();