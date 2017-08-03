/* eslint-env node, jasmine */
/* eslint max-lines: ["warn", 1000] */
'use strict';
describe('Session Service', function () {
    var $scope, $state, $q, $timeout, Account, accounts, sessionService,
        SessionConfig, loadingService, storageService, popupService;

    // Before each test load our api.session module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('app.session'));
    beforeEach(angular.mock.module('modelMocks'));

    beforeEach(inject(function (_$rootScope_, _$state_, _$q_, _$timeout_) {
        $state = _$state_;
        $q = _$q_;
        $scope = _$rootScope_.$new();
        $timeout = _$timeout_;
    }));

    beforeEach(inject(function (_Account_, _accountMockService_, _sessionService_,
        _SessionConfig_, _loadingService_, _storageService_, _popupService_) {
        Account = _Account_;
        accounts = _accountMockService_.accounts.data;
        sessionService = _sessionService_;
        SessionConfig = _SessionConfig_;
        loadingService = _loadingService_;
        storageService = _storageService_;
        popupService = _popupService_;
    }));

    beforeEach(function () {
        spyOn(loadingService, 'show').and.returnValue($q.resolve());
        spyOn(loadingService, 'hide').and.returnValue($q.resolve());
    });

    // A simple test to verify the friendsService factory exists
    it('should exist', function () {
        expect(sessionService).toBeDefined();
    });

    describe('changePassword', function () {
        var result, account;

        beforeEach(function () {
            account = angular.copy(accounts[0]);
            account.oldPassword = account.password;
            account.newPassword = account.password + '1';

            spyOn(Account, 'changePassword').and.callFake(function (account) {
                if (account.newPassword === account.newPasswordRepeated) {
                    accounts[0].password = account.newPassword;

                    return { $promise: $q.resolve(accounts[0]) };
                }

                return { $promise: $q.reject('No allowed') };
            });
            spyOn(sessionService, 'changePassword').and.callThrough();
        });

        it('should exist', function () {
            expect(sessionService.changePassword).toBeDefined();
        });

        it('should change the password of a valid account', function () {
            account.newPasswordRepeated = account.password + '1';

            sessionService.changePassword(account).then(function (data) {
                result = data;
            });
            $scope.$apply();

            expect(Account.changePassword).toHaveBeenCalledWith(account);
            expect(sessionService.changePassword).toHaveBeenCalledWith(account);

            expect(result instanceof Account).toEqual(true);
            expect(result).toEqual(accounts[0]);
        });

        it('should reject the password change if differente new password are input', function () {
            account.newPasswordRepeated = account.password + '2';

            sessionService.changePassword(account).catch(function (data) {
                result = data;
            });
            $scope.$apply();

            expect(Account.changePassword).toHaveBeenCalledWith(account);
            expect(sessionService.changePassword).toHaveBeenCalledWith(account);

            expect(result).toEqual('No allowed');
        });
    });

    describe('doLogin', function () {
        var result, account;

        beforeEach(function () {
            account = angular.copy(accounts[0]);

            spyOn(Account, 'login').and.callFake(function (account, success) {
                if (account.password === accounts[0].password) {
                    success(accounts[0]);
                    $scope.$apply();

                    return { $promise: $q.resolve(accounts[0]) };
                }

                return { $promise: $q.reject('No allowed') };
            });

            spyOn(Account, 'keepAlive').and.returnValue({ $promise: $q.resolve(true) });
            spyOn(Account, 'logout').and.returnValue({ $promise: $q.resolve(true) });

            spyOn(storageService, 'save').and.returnValue(null);
            spyOn($state, 'go').and.returnValue(true);
            spyOn(sessionService, 'doLogin').and.callThrough();
        });

        it('should exist', function () {
            expect(sessionService.doLogin).toBeDefined();
        });

        it('should login with a valid account and go to main', function () {

            sessionService.doLogin(account).then(function (data) {
                result = data;
            });
            $scope.$apply();

            expect(Account.login).toHaveBeenCalledWith(account, jasmine.any(Function));
            expect(sessionService.doLogin).toHaveBeenCalledWith(account);

            expect(result instanceof Account).toEqual(true);
            expect(result).toEqual(accounts[0]);

            expect(loadingService.show).toHaveBeenCalled();
            expect(loadingService.hide).toHaveBeenCalled();
            expect(storageService.save).toHaveBeenCalledWith(SessionConfig.storageName, jasmine.any(Object));
            expect($state.go).toHaveBeenCalledWith(SessionConfig.loginState);
        });

        it('should not login with an invalid account', function () {
            account.password = account.password + '1';

            sessionService.doLogin(account).catch(function (data) {
                result = data;
            });
            $scope.$apply();

            expect(Account.login).toHaveBeenCalledWith(account, jasmine.any(Function));
            expect(sessionService.doLogin).toHaveBeenCalledWith(account);

            expect(result).toEqual('No allowed');

            expect(loadingService.show).toHaveBeenCalled();
            expect(loadingService.hide).not.toHaveBeenCalled();
            expect(storageService.save).not.toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalled();
        });

        it('should login for an specific time if no keepAlive is called', function () {
            spyOn(popupService, 'getPopup').and.returnValue($q.resolve(true));

            sessionService.doLogin(account).then(function (data) {
                result = data;
            });
            $scope.$apply();

            expect(result).toEqual(accounts[0]);

            expect($state.go).toHaveBeenCalledWith(SessionConfig.loginState);

            $timeout.flush();
            $scope.$apply();
            $timeout.flush();

            // this will throw an exception if there are any pending timeouts.
            $timeout.verifyNoPendingTasks();

            expect(popupService.getPopup).toHaveBeenCalledWith('session.extendSession', null);
            expect($state.go).toHaveBeenCalledWith('login');
            expect(Account.logout).toHaveBeenCalled();
        });

        it('should set userData even if response is empty', function () {
            Account.login.and.callFake(function (account, success) {
                success(null);

                return { $promise: $q.resolve(accounts[0]) };
            });
            sessionService.doLogin(account);

            expect(sessionService.doLogin).toHaveBeenCalledWith(account);
            expect(storageService.save).toHaveBeenCalledWith(SessionConfig.storageName, jasmine.any(Object));
        });
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
            expect(storageService.load).toHaveBeenCalledWith(SessionConfig.storageName);
            expect(result).toEqual(userData);
        });
    });

    describe('goToLogin', function () {

        beforeEach(function () {

            spyOn(popupService, 'closeAllPopups').and.returnValue($q.resolve());
            spyOn($state, 'go').and.returnValue(null);
            spyOn(sessionService, 'goToLogin').and.callThrough();
        });

        it('should exist', function () {
            expect(sessionService.goToLogin).toBeDefined();
        });

        it('should go to login state and close all popups', function () {

            sessionService.goToLogin();

            expect(sessionService.goToLogin).toHaveBeenCalled();
            expect($state.go).toHaveBeenCalledWith('login');
            expect(popupService.closeAllPopups).toHaveBeenCalledWith(true);
        });
    });

    describe('handleTimeout', function () {
        var rejection;

        beforeEach(function () {

            spyOn(popupService, 'getPopup').and.returnValue($q.resolve(true));
            spyOn(Account, 'keepAlive').and.returnValue({ $promise: $q.resolve(true) });
            spyOn(Account, 'logout').and.returnValue({ $promise: $q.resolve(true) });

            spyOn($state, 'go').and.returnValue(true);
            spyOn(sessionService, 'handleTimeout').and.callThrough();
        });

        it('should exist', function () {
            expect(sessionService.handleTimeout).toBeDefined();
        });

        it('should prompt no auth popup and logout when called with a rejection', function () {
            rejection = $q.reject();

            sessionService.handleTimeout(rejection);

            expect(loadingService.hide).toHaveBeenCalled();
            expect(popupService.getPopup).toHaveBeenCalledWith('session.noAuthorization', null);
            expect(sessionService.handleTimeout).toHaveBeenCalledWith(rejection);

            $timeout.flush();
            $timeout.verifyNoPendingTasks();

            expect(Account.logout).toHaveBeenCalled();
            expect($state.go).toHaveBeenCalledWith('login');
        });

        it('should prompt extend session popup when called without a rejection', function () {
            sessionService.handleTimeout();

            expect(sessionService.handleTimeout).toHaveBeenCalled();
            expect(loadingService.hide).toHaveBeenCalled();
            expect(popupService.getPopup).toHaveBeenCalledWith('session.extendSession', null);
        });

        it('should extend session when extend session button is clicked', function () {
            sessionService.handleTimeout();

            expect(sessionService.handleTimeout).toHaveBeenCalled();
            expect(loadingService.hide).toHaveBeenCalled();
            expect(popupService.getPopup).toHaveBeenCalledWith('session.extendSession', null);

            $scope.$apply();

            expect(Account.keepAlive).toHaveBeenCalled();
        });

        it('should logout when end session button is clicked', function () {
            popupService.getPopup.and.returnValue($q.resolve(false));
            spyOn(storageService, 'clear').and.returnValue(null);
            sessionService.handleTimeout();

            expect(sessionService.handleTimeout).toHaveBeenCalled();
            expect(loadingService.hide).toHaveBeenCalled();
            expect(popupService.getPopup).toHaveBeenCalledWith('session.extendSession', null);

            $timeout.flush();
            $scope.$apply();

            expect(Account.keepAlive).not.toHaveBeenCalled();
            expect(Account.logout).toHaveBeenCalled();
            expect(storageService.clear).toHaveBeenCalled();
        });

        it('should logout when popup is ignored', function () {
            popupService.getPopup.and.returnValue($q.defer().promise);
            spyOn(storageService, 'clear').and.returnValue(null);
            sessionService.handleTimeout();

            expect(sessionService.handleTimeout).toHaveBeenCalled();
            expect(loadingService.hide).toHaveBeenCalled();
            expect(popupService.getPopup).toHaveBeenCalledWith('session.extendSession', null);

            $timeout.flush();
            $scope.$apply();

            expect(Account.keepAlive).not.toHaveBeenCalled();
            expect(Account.logout).toHaveBeenCalled();
            expect(storageService.clear).toHaveBeenCalled();
        });
    });

    describe('isLoggedIn', function () {
        var result, account;

        beforeEach(function () {
            spyOn(sessionService, 'isLoggedIn').and.callThrough();
        });

        it('should exist', function () {
            expect(sessionService.isLoggedIn).toBeDefined();
        });

        it('should return false if user is not logged', function () {

            result = sessionService.isLoggedIn();

            expect(sessionService.isLoggedIn).toHaveBeenCalled();
            expect(result).toEqual(false);
        });

        it('should return true if user is logged', function () {
            account = angular.copy(accounts[0]);

            spyOn(Account, 'login').and.callFake(function (account, success) {
                if (account.password === accounts[0].password) {
                    success(accounts[0]);
                    $scope.$apply();

                    return { $promise: $q.resolve(accounts[0]) };
                }

                return { $promise: $q.reject('No allowed') };
            });
            spyOn(sessionService, 'doLogin').and.callThrough();

            sessionService.doLogin(account);
            $scope.$apply();

            result = sessionService.isLoggedIn();

            expect(sessionService.isLoggedIn).toHaveBeenCalled();
            expect(result).toEqual(true);
        });
    });

    describe('keepAlive', function () {

        beforeEach(function () {
            spyOn(Account, 'logout').and.returnValue({ $promise: $q.resolve(true) });

            spyOn(sessionService, 'keepAlive').and.callThrough();
        });

        it('should exist', function () {
            expect(sessionService.keepAlive).toBeDefined();
        });

        it('should keep alive the session if time is not over', function () {
            spyOn(Account, 'keepAlive').and.returnValue({ $promise: $q.resolve(true) });

            sessionService.keepAlive();
            $scope.$apply();

            expect(sessionService.keepAlive).toHaveBeenCalled();
            expect(Account.keepAlive).toHaveBeenCalled();
            expect(Account.logout).not.toHaveBeenCalled();
        });

        it('should destroy the session if time is was over', function () {
            spyOn(Account, 'keepAlive').and.returnValue({ $promise: $q.reject() });

            sessionService.keepAlive();
            $scope.$apply();

            expect(sessionService.keepAlive).toHaveBeenCalled();
            expect(Account.keepAlive).toHaveBeenCalled();
            expect(Account.logout).toHaveBeenCalled();
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
            spyOn(Account, 'logout').and.returnValue({ $promise: $q.resolve(true) });

            sessionService.logOut();
            $scope.$apply();

            expect(sessionService.logOut).toHaveBeenCalled();
            expect(storageService.clear).toHaveBeenCalled();
            expect(Account.logout).toHaveBeenCalled();
        });

        it('should logout and reset session if server communication fails', function () {
            spyOn(Account, 'logout').and.returnValue({ $promise: $q.reject() });

            sessionService.logOut();
            $scope.$apply();

            expect(sessionService.logOut).toHaveBeenCalled();
            expect(storageService.clear).toHaveBeenCalled();
            expect(Account.logout).toHaveBeenCalled();
        });
    });

    describe('refreshTimer', function () {
        var timeout;

        beforeEach(function () {
            timeout = jasmine.createSpy('$timeout');

            spyOn(sessionService, 'refreshTimer').and.callThrough();
        });

        it('should exist', function () {
            expect(sessionService.refreshTimer).toBeDefined();
        });

        it('should refresh session timer', function () {
            sessionService.refreshTimer();
            $scope.$apply();

            expect(sessionService.refreshTimer).toHaveBeenCalled();
            expect(timeout).not.toHaveBeenCalled();
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
            storageService.clear(SessionConfig.storageName);
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
