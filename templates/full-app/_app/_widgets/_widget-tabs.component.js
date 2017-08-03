(function () {
    'use strict';
    angular
        .module('app.widgets')
        .component('rdWidgetTabs', {
            requires: '^rdWidget',
            bindings: {
                active: '@?',
                select: '&',
                tabs: '<'
            },
            template: '<uib-tabset active="active">' +
            '<uib-tab index="tab.index" ng-repeat="(key, tab) in $ctrl.tabs | ' +
            'orderObjectBy:\'index\':false" heading=' +
            '"{{tab.label}}{{tab.amount || tab.amount===0? \' (\'+tab.amount+\')\' : \'\'}}" ' +
            'disable="tab.amount === 0" ' +
            'select="$ctrl.tabs && $ctrl.select({selectedTab: tab})">' +
            '</uib-tab>' +
            '</uib-tabset>'
        });
})();
