(function () {
    'use strict';
    angular
        .module('common')
        .directive('compareTo', compareTo);

    function compareTo() {
        return {
            restrict: 'A',
            require: { ngModelCtrl: 'ngModel' },
            scope: {},
            controller: compareToCtrl,
            controllerAs: '$ctrl',
            bindToController: { otherModelValue: '<compareTo', model: '<ngModel' }
        };
    }

    compareToCtrl.$inject = [];
    function compareToCtrl() {
        var ctrl = this;

        ctrl.validate = validate;

        ctrl.$onInit = $onInit;
        ctrl.$onChanges = changed;

        function $onInit() {
            ctrl.ngModelCtrl.$validators.compareTo = validate;
        }

        function changed(changes) {
            if (changes.otherModelValue) {
                ctrl.ngModelCtrl.$validate();
            }
        }

        function validate(modelValue) {
            return modelValue === ctrl.otherModelValue;
        }
    }
})();