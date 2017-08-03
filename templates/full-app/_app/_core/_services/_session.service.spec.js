/* eslint-env node, jasmine */
/* eslint max-lines: ["warn", 1000] */
'use strict';
describe('Session Service', function () {
    var $scope, $state, $q, sessionService, storageService, popupService;

    // Before each test load our api.core module
    beforeEach(angular.mock.module('common'));
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('modelMocks'));

    beforeEach(inject(function (_$rootScope_, _$state_, _$q_) {
        $state = _$state_;
        $q = _$q_;
        $scope = _$rootScope_.$new();
    }));

    beforeEach(inject(function (_sessionService_, _storageService_, _popupService_) {
        sessionService = _sessionService_;
        storageService = _storageService_;
        popupService = _popupService_;
    }));

    // A simple test to verify the friendsService factory exists
    it('should exist', function () {
        expect(sessionService).toBeDefined();
    });

    describe('getSessionParam', function () {
        var result, paramName, paramValue;

        beforeEach(function () {
            paramName = 'param';
            paramValue = 'value';

            spyOn(sessionService, 'setSessionParam').and.callThrough();
            spyOn(sessionService, 'getSessionParam').and.callThrough();
        });

        it('should exist', function () {
            expect(sessionService.getSessionParam).toBeDefined();
        });

        it('should return an existing session param', function () {

            result = sessionService.getSessionParam(paramName);

            expect(sessionService.getSessionParam).toHaveBeenCalledWith(paramName);
            expect(result).toEqual(false);
        });

        it('should return false with an invalid session param', function () {
            result = sessionService.setSessionParam(paramName, paramValue);

            result = sessionService.getSessionParam(paramName);

            expect(sessionService.getSessionParam).toHaveBeenCalledWith(paramName);
            expect(result).toEqual(paramValue);
        });
    });

    describe('getUserData', function () {
        var result, userData;

        beforeEach(function () {
            userData = { someParam: 'someValue' };

            spyOn(storageService, 'load').and.callFake(function () {
                return userData;
            });
            spyOn(sessionService, 'getUserData').and.callThrough();
        });

        it('should exist', function () {
            expect(sessionService.getUserData).toBeDefined();
        });

        it('should return stored userData', function () {

            result = sessionService.getUserData();

            expect(sessionService.getUserData).toHaveBeenCalled();
            expect(storageService.load).toHaveBeenCalled();
            expect(result).toEqual(userData);
        });
    });

    describe('handleTimeout', function () {
        beforeEach(function () {

            spyOn(popupService, 'getPopup').and.returnValue($q.resolve(true));

            spyOn($state, 'go').and.returnValue(true);
            spyOn(sessionService, 'handleTimeout').and.callThrough();
        });

        it('should exist', function () {
            expect(sessionService.handleTimeout).toBeDefined();
        });

        it('should redirect to login if param is true', function () {

            sessionService.handleTimeout(true);

            expect(sessionService.handleTimeout).toHaveBeenCalledWith(true);

            expect($state.go).toHaveBeenCalledWith('login');
        });

        it('should return promise if param is false', function () {
            var result = sessionService.handleTimeout(false);

            expect(sessionService.handleTimeout).toHaveBeenCalledWith(false);
            expect(result.then instanceof Function).toEqual(true);
        });
    });

    describe('isLoggedIn', function () {
        var result;

        beforeEach(function () {
            spyOn(sessionService, 'isLoggedIn').and.callThrough();
        });

        it('should exist', function () {
            expect(sessionService.isLoggedIn).toBeDefined();
        });

        it('should return true if user is logged', function () {

            result = sessionService.isLoggedIn();

            expect(sessionService.isLoggedIn).toHaveBeenCalled();
            expect(result).toEqual(true);
        });
    });

    describe('logOut', function () {
        beforeEach(function () {
            spyOn(storageService, 'clear').and.returnValue(true);

            spyOn(sessionService, 'logOut').and.callThrough();
        });

        it('should exist', function () {
            expect(sessionService.logOut).toBeDefined();
        });

        it('should logout and reset session', function () {

            sessionService.logOut();
            $scope.$apply();

            expect(sessionService.logOut).toHaveBeenCalled();
            expect(storageService.clear).toHaveBeenCalled();
        });
    });

    describe('setSessionParam', function () {
        var result, paramName, paramValue;

        beforeEach(function () {
            paramName = 'param';
            paramValue = 'value';

            spyOn(storageService, 'save').and.returnValue(true);
            spyOn(storageService, 'load').and.returnValue(null);

            spyOn(sessionService, 'setSessionParam').and.callThrough();
            spyOn(sessionService, 'getSessionParam').and.callThrough();
        });

        it('should exist', function () {
            expect(sessionService.setSessionParam).toBeDefined();
        });

        it('should set a session param', function () {
            sessionService.setSessionParam(paramName, paramValue);

            expect(sessionService.setSessionParam).toHaveBeenCalledWith(paramName, paramValue);
            expect(storageService.save).toHaveBeenCalled();

            result = sessionService.getSessionParam(paramName);

            expect(sessionService.getSessionParam).toHaveBeenCalledWith(paramName);
            expect(result).toEqual(paramValue);
        });

        it('should set a session param if storage is empty too', function () {
            storageService.clear('sessionMock');
            sessionService.getUserData();
            sessionService.setSessionParam(paramName, paramValue);

            expect(sessionService.setSessionParam).toHaveBeenCalledWith(paramName, paramValue);
            expect(storageService.save).toHaveBeenCalled();

            result = sessionService.getSessionParam(paramName);

            expect(sessionService.getSessionParam).toHaveBeenCalledWith(paramName);
            expect(result).toEqual(paramValue);
        });
    });
});
