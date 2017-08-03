(function () {
    'use strict';
    angular
        .module('app.widgets')
        .component('rdWidgetFooter', {
            requires: '^rdWidget',
            transclude: true,
            template: '<div class="widget-footer" ng-transclude></div><div class="clear-fix"></div>'
        });
})();
