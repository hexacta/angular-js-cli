(function () {
    'use strict';
    angular
        .module('app.widgets')
        .component('rdWidget', {
            transclude: true,
            template: '<div class="widget" ng-transclude></div>'
        });
})();
