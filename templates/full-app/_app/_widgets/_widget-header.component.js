(function () {
    'use strict';
    angular
        .module('app.widgets')
        .component('rdWidgetHeader', {
            requires: '^rdWidget',
            bindings: {
                classes: '@?',
                icon: '@',
                title: '@'
            },
            transclude: true,
            template: '<div class="widget-header" ng-class="$ctrl.classes"><div class="row title">' +
            '{{$ctrl.title}} </div><div class="transcluded" ng-transclude></div></div></div>'
        });
})();
