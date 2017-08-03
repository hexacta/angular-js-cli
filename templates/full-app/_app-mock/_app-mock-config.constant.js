(function () {
    'use strict';
    var appMockConfig = {
        appTemplates: '.template.html',
        pathExceptions: ['uib/template',
            'views/',
            'bootstrap/',
            '.template.html'],
        fakeDelay: 1000
    };

    angular.module('appMock')
        .constant('AppMockConfig', appMockConfig);
})();