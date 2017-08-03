/* eslint-env node, jasmine */
'use strict';
describe('Account', function () {
    var $httpBackend, Account, accountMockService, mocksHelper;

    // Before each test load our api.session module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('app.session'));
    beforeEach(angular.mock.module('modelMocks'));

    beforeEach(inject(function (_$httpBackend_, _accountMockService_, _Account_, _mocksHelper_) {
        $httpBackend = _$httpBackend_;
        Account = _Account_;
        accountMockService = _accountMockService_;
        mocksHelper = _mocksHelper_;
    }));

    beforeEach(function () {
        mocksHelper.addMocks(accountMockService.APIMethods);
    });

    // A simple test to verify the groupsService factory exists
    it('should exist', function () {
        expect(Account).toBeDefined();
    });

    describe('login', function () {
        it('should exist', function () {
            expect(Account.login).toBeDefined();
        });

        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Account, 'login').and.callThrough();
        });

        afterEach(function () {
            expect(accountMockService.accounts.data.length).toEqual(3);
        });

        it('should return a Account when login in with a valid user and pass', function () {
            var user = {
                username: 'guest',
                password: 'guest'
            };

            result = Account.login(user);

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(Account.login).toHaveBeenCalledWith(user);
            expect(result instanceof Account).toEqual(true);
            expect(result.id).toEqual(1);
            expect(result.username).toEqual('guest');
        });

        it('should return a 403 when called with an invalid password', function () {
            var user = {
                username: 'guest',
                password: 'guest1'
            };

            Account.login(user).$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(Account.login).toHaveBeenCalledWith(user);
            expect(result.error).toEqual('No allowed');
        });

        it('should return a 404 when called with an invalid user', function () {
            var user = {
                username: 'guest12',
                password: 'guest'
            };

            Account.login(user).$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(Account.login).toHaveBeenCalledWith(user);
            expect(result.error).toEqual('No User');
        });
    });

    describe('changePassword', function () {
        it('should exist', function () {
            expect(Account.changePassword).toBeDefined();
        });

        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Account, 'changePassword').and.callThrough();
        });

        afterEach(function () {
            expect(accountMockService.accounts.data.length).toEqual(3);
        });

        it('should return a Account when changing Password in with a valid user and pass', function () {
            var user = {
                username: 'guest',
                oldPassword: 'guest',
                newPassword: 'guest2',
                newPasswordRepeated: 'guest2'
            };

            result = Account.changePassword(user);

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(Account.changePassword).toHaveBeenCalledWith(user);
            expect(result instanceof Account).toEqual(true);
            expect(result.id).toEqual(1);
            expect(result.username).toEqual('guest');
            expect(result.password).toEqual('guest2');
        });

        it('should return a 403 when called with an invalid password', function () {
            var user = {
                username: 'guest',
                oldPassword: 'guest1',
                newPassword: 'guest2',
                newPasswordRepeated: 'guest2'
            };

            Account.changePassword(user).$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(Account.changePassword).toHaveBeenCalledWith(user);
            expect(result.error).toEqual('No allowed');
        });

        it('should return a 404 when called with an invalid user', function () {
            var user = {
                username: 'guest12',
                oldPassword: 'guest',
                newPassword: 'guest2',
                newPasswordRepeated: 'guest2'
            };

            Account.changePassword(user).$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(Account.changePassword).toHaveBeenCalledWith(user);
            expect(result.error).toEqual('No User');
        });
    });

    describe('logout', function () {
        it('should exist', function () {
            expect(Account.logout).toBeDefined();
        });

        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Account, 'logout').and.callThrough();
        });

        afterEach(function () {
            expect(accountMockService.accounts.data.length).toEqual(3);
        });

        it('should return true if user could log out', function () {
            var user = new Account({
                username: 'guest',
                oldPassword: 'guest'
            });

            result = user.$logout();

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(Account.logout).toHaveBeenCalled();
            expect(result).not.toEqual({});
        });
    });

    describe('keepAlive', function () {
        it('should exist', function () {
            expect(Account.keepAlive).toBeDefined();
        });

        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Account, 'keepAlive').and.callThrough();
        });

        afterEach(function () {
            expect(accountMockService.accounts.data.length).toEqual(3);
        });

        it('should keep alive session', function () {
            result = Account.keepAlive();

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(Account.keepAlive).toHaveBeenCalled();
            expect(result).not.toEqual({});
        });
    });
});
