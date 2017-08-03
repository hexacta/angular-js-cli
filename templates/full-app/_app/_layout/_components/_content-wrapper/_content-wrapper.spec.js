/* eslint-env node, jasmine */
'use strict';
describe('ContentWrapper Component', function () {
    var $componentController, $state, $window,
        ContentWrapperComponentCtrl, injection, sessionService;

    // Before each test load our api.layout module
    beforeEach(angular.mock.module('app.core'));
    /* replace:session */
    beforeEach(angular.mock.module('app.session'));
    /* endreplace:session */
    beforeEach(angular.mock.module('app.layout'));

    beforeEach(inject(function (_$componentController_, _$state_,
        _$window_, _sessionService_) {
        $componentController = _$componentController_;
        $state = _$state_;
        $window = _$window_;
        sessionService = _sessionService_;
    }));

    beforeEach(function () {
        injection = {
            $window: $window,
            $state: $state,
            sessionService: sessionService
        };
        ContentWrapperComponentCtrl = $componentController('contentWrapper',
            injection, null);
    });

    describe('ContentWrapper Ctrl', function () {
        it('should exist', function () {
            expect(ContentWrapperComponentCtrl).toBeDefined();
        });

        it('Shuld have only exports defined before $onInit', function () {
            expect(ContentWrapperComponentCtrl.allowAccess).toBeDefined();
            expect(ContentWrapperComponentCtrl.getTitle).toBeDefined();
            expect(ContentWrapperComponentCtrl.goBack).toBeDefined();
            expect(ContentWrapperComponentCtrl.logOut).toBeDefined();
            expect(ContentWrapperComponentCtrl.toggleSidebar).toBeDefined();

            expect(ContentWrapperComponentCtrl.user).not.toBeDefined();

            expect(ContentWrapperComponentCtrl.$onInit).toBeDefined();
        });
    });

    describe('$onInit', function () {
        var user;

        beforeEach(function () {
            user = { name: 'user' };

            spyOn(sessionService, 'getSessionParam').and.returnValue();
            spyOn(sessionService, 'setSessionParam').and.returnValue();
            spyOn(sessionService, 'getUserData').and.returnValue(user);
            spyOn(sessionService, 'handleTimeout').and.returnValue(true);

            spyOn(ContentWrapperComponentCtrl, '$onInit').and.callThrough();
        });

        it('shuld exist', function () {
            expect(ContentWrapperComponentCtrl.$onInit).toBeDefined();
        });

        it('shuld init menu toggle export var if not stored', function () {

            ContentWrapperComponentCtrl.$onInit();

            expect(ContentWrapperComponentCtrl.$onInit).toHaveBeenCalled();
            expect(sessionService.getSessionParam).toHaveBeenCalledWith('toggleMenu');
            expect(sessionService.setSessionParam).toHaveBeenCalledWith('toggleMenu', false);
            expect(ContentWrapperComponentCtrl.toggle).toEqual(false);
        });

        it('shuld init menu toggle export var with stored value if exists', function () {
            sessionService.getSessionParam.and.returnValue(true);

            ContentWrapperComponentCtrl.$onInit();

            expect(ContentWrapperComponentCtrl.$onInit).toHaveBeenCalled();
            expect(sessionService.getSessionParam).toHaveBeenCalledWith('toggleMenu');
            expect(sessionService.setSessionParam).not.toHaveBeenCalled();
            expect(ContentWrapperComponentCtrl.toggle).toBeDefined();
        });

        it('shuld load user data if an user is logged in ', function () {
            spyOn(sessionService, 'isLoggedIn').and.returnValue(true);

            ContentWrapperComponentCtrl.$onInit();

            expect(ContentWrapperComponentCtrl.$onInit).toHaveBeenCalled();
            expect(sessionService.getUserData).toHaveBeenCalled();
            expect(sessionService.isLoggedIn).toHaveBeenCalled();
            expect(sessionService.handleTimeout).not.toHaveBeenCalled();
            expect(ContentWrapperComponentCtrl.user).toEqual(user);
        });

        it('shuld load execute a session timeout if user is not logged in', function () {
            spyOn(sessionService, 'isLoggedIn').and.returnValue(false);

            ContentWrapperComponentCtrl.$onInit();

            expect(ContentWrapperComponentCtrl.$onInit).toHaveBeenCalled();
            expect(sessionService.getUserData).toHaveBeenCalled();
            expect(sessionService.isLoggedIn).toHaveBeenCalled();
            expect(sessionService.handleTimeout).toHaveBeenCalledWith(true);
        });
    });

    describe('allowAccess', function () {
        var result;

        beforeEach(function () {
            spyOn(ContentWrapperComponentCtrl, 'allowAccess').and.callThrough();
        });

        it('shuld exist', function () {
            expect(ContentWrapperComponentCtrl.allowAccess).toBeDefined();
        });

        it('shuld not allow any screen if no user is logged in', function () {
            ContentWrapperComponentCtrl.user = null;

            result = ContentWrapperComponentCtrl.allowAccess();

            expect(ContentWrapperComponentCtrl.allowAccess).toHaveBeenCalled();
            expect(result).toEqual(ContentWrapperComponentCtrl.user);
        });

        it('shuld allow a screen if user has no restrictedScreens', function () {
            ContentWrapperComponentCtrl.user = {};

            result = ContentWrapperComponentCtrl.allowAccess();

            expect(ContentWrapperComponentCtrl.allowAccess).toHaveBeenCalled();
            expect(result).toEqual(true);
        });

        it('shuld allow a screen if user does not have it on restrictedScreens', function () {
            ContentWrapperComponentCtrl.user = { restrictedScreens: [] };

            result = ContentWrapperComponentCtrl.allowAccess();

            expect(ContentWrapperComponentCtrl.allowAccess).toHaveBeenCalled();
            expect(result).toEqual(true);
        });

        it('shuld not allow a screen if user has it on restrictedScreens', function () {
            ContentWrapperComponentCtrl.user = { restrictedScreens: [$state.current.internalName] };

            result = ContentWrapperComponentCtrl.allowAccess();

            expect(ContentWrapperComponentCtrl.allowAccess).toHaveBeenCalled();
            expect(result).toEqual(false);
        });
    });

    describe('getTitle', function () {
        var result;

        beforeEach(function () {
            spyOn(ContentWrapperComponentCtrl, 'getTitle').and.callThrough();
        });

        it('shuld exist', function () {
            expect(ContentWrapperComponentCtrl.getTitle).toBeDefined();
        });

        it('shuld return title from $state', function () {
            result = ContentWrapperComponentCtrl.getTitle();

            expect(ContentWrapperComponentCtrl.getTitle).toHaveBeenCalled();
            expect(result).toEqual($state.current.title);
        });
    });

    describe('goBack', function () {
        beforeEach(function () {
            spyOn($window.history, 'back').and.returnValue();

            spyOn(ContentWrapperComponentCtrl, 'goBack').and.callThrough();
        });

        it('shuld exist', function () {
            expect(ContentWrapperComponentCtrl.goBack).toBeDefined();
        });

        it('shuld return to the previous state from $window.history', function () {
            ContentWrapperComponentCtrl.goBack();

            expect(ContentWrapperComponentCtrl.goBack).toHaveBeenCalled();
            expect($window.history.back).toHaveBeenCalled();
        });
    });

    describe('logOut', function () {
        beforeEach(function () {
            spyOn(sessionService, 'logOut').and.returnValue();

            spyOn(ContentWrapperComponentCtrl, 'logOut').and.callThrough();
        });

        it('shuld exist', function () {
            expect(ContentWrapperComponentCtrl.logOut).toBeDefined();
        });

        it('shuld return to the previous state from $window.history', function () {
            ContentWrapperComponentCtrl.logOut();

            expect(ContentWrapperComponentCtrl.logOut).toHaveBeenCalled();
            expect(sessionService.logOut).toHaveBeenCalled();
        });
    });

    describe('toggleSidebar', function () {
        beforeEach(function () {
            ContentWrapperComponentCtrl.toggle = false;
            spyOn(sessionService, 'setSessionParam').and.returnValue();

            spyOn(ContentWrapperComponentCtrl, 'toggleSidebar').and.callThrough();
        });

        it('shuld exist', function () {
            expect(ContentWrapperComponentCtrl.toggleSidebar).toBeDefined();
        });

        it('shuld switch toggle and save the new value', function () {
            ContentWrapperComponentCtrl.toggleSidebar();

            expect(ContentWrapperComponentCtrl.toggleSidebar).toHaveBeenCalled();
            expect(sessionService.setSessionParam).toHaveBeenCalledWith('toggleMenu', true);
        });
    });
});
