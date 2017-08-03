(function () {
    'use strict';
    angular
        .module('app.widgets')
        .component('rdWidgetBody', {
            requires: '^rdWidget',
            bindings: {
                classes: '@?',
                loading: '<?'
            },
            transclude: true,
            template: '<div class="widget-body" ng-class="$ctrl.classes"><rd-loading ng-show="$ctrl.loading">' +
            '</rd-loading><div ng-hide="$ctrl.loading" class="widget-content" ng-transclude></div></div>'
        });
})();
