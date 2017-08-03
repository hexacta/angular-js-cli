(function () {
    'use strict';

    angular.module('appMock', ['app', 'ngMockE2E', 'modelMocks'])
        .run(appRun);

    // Dependencies necessary for mocks
    appRun.$inject = [
        '$httpBackend',
        /* replace:session */
        'accountMockService',
        /* endreplace:session */
        /* replace:friends */
        'friendMockService',
        'groupMockService',
        /* endreplace:friends */
        'AppMockConfig',
        'mocksHelper'
    ];

    function appRun(
        $httpBackend,
        /* replace:session */
        accountMockService,
        /* endreplace:session */
        /* replace:friends */
        friendMockService,
        groupMockService,
        /* endreplace:friends */
        AppMockConfig,
        mocksHelper) {

        /* replace:friends */
        mocksHelper.addMocks(friendMockService.APIMethods);
        mocksHelper.addMocks(groupMockService.APIMethods);
        /* endreplace:friends */
        /* replace:session */
        mocksHelper.addMocks(accountMockService.APIMethods);
        /* endreplace:session */

        var regString = mocksHelper.regEsc(AppMockConfig.appTemplates);
        $httpBackend.whenGET(new RegExp(regString)).passThrough();
    }
})();
