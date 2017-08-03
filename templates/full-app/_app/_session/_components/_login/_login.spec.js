/* eslint-env node, jasmine */
'use strict';
describe('Login Component', function () {
    var $scope, $componentController, $q, LoginComponentCtrl, injection,
        sessionService, popupService, loadingService;

    // Before each test load our api.session module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('app.session'));

    beforeEach(inject(function (_$rootScope_, _$componentController_, _$q_, _sessionService_,
        _popupService_, _loadingService_) {
        $componentController = _$componentController_;
        $q = _$q_;
        sessionService = _sessionService_;
        popupService = _popupService_;
        loadingService = _loadingService_;
        $scope = _$rootScope_.$new();
    }));

    beforeEach(function () {
        injection = {
            sessionService: sessionService,
            popupService: popupService,
            loadingService: loadingService
        };
        LoginComponentCtrl = $componentController('login',
            injection, null);
    });

    beforeEach(function () {
        spyOn(loadingService, 'show').and.returnValue($q.resolve());
        spyOn(loadingService, 'hide').and.returnValue($q.resolve());
        spyOn(popupService, 'getPopup').and.returnValue($q.resolve(true));
    });

    describe('Login Ctrl', function () {
        it('should exist', function () {
            expect(LoginComponentCtrl).toBeDefined();
        });

        it('Shuld have exports defined', function () {
            expect(LoginComponentCtrl.user).toBeDefined();
            expect(LoginComponentCtrl.doLogin).toBeDefined();
            expect(LoginComponentCtrl.fieldHasError).toBeDefined();
        });
    });

    describe('doLogin', function () {
        beforeEach(function () {
            LoginComponentCtrl.loginForm = { $valid: true };

            spyOn(sessionService, 'doLogin').and.returnValue($q.reject());

            spyOn(LoginComponentCtrl, 'doLogin').and.callThrough();
        });

        it('shuld exist', function () {
            expect(LoginComponentCtrl.doLogin).toBeDefined();
        });

        it('shuld fail if form is not valid', function () {
            LoginComponentCtrl.loginForm = { $valid: false };

            LoginComponentCtrl.doLogin();

            expect(popupService.getPopup).toHaveBeenCalledWith('session.invalidDataError');
            expect(loadingService.show).not.toHaveBeenCalled();
            expect(sessionService.doLogin).not.toHaveBeenCalled();
        });

        it('shuld fail if form is valid but the service validation fails', function () {
            LoginComponentCtrl.doLogin();
            $scope.$apply();

            expect(sessionService.doLogin).toHaveBeenCalled();
            expect(popupService.getPopup).toHaveBeenCalledWith('session.invalidCredentialsError');
            expect(loadingService.hide).toHaveBeenCalled();
        });

        it('shuld succeed if form is valid but the service validation succeeds', function () {
            sessionService.doLogin.and.returnValue($q.resolve());

            LoginComponentCtrl.doLogin();
            $scope.$apply();

            expect(sessionService.doLogin).toHaveBeenCalled();
            expect(popupService.getPopup).not.toHaveBeenCalled();
            expect(loadingService.hide).not.toHaveBeenCalled();
        });
    });

    describe('fieldHasError', function () {

        function testField(field, expectValue) {
            var result = LoginComponentCtrl.fieldHasError(field);

            expect(LoginComponentCtrl.fieldHasError).toHaveBeenCalledWith(field);
            expect(result).toEqual(expectValue);
        }

        beforeEach(function () {
            LoginComponentCtrl.loginForm = {
                $submitted: true,
                field1: {
                    $invalid: false,
                    $touched: false
                },
                field2: {
                    $invalid: true,
                    $touched: true
                },
                field3: {
                    $invalid: true,
                    $touched: false
                },
                field4: {
                    $invalid: false,
                    $touched: true
                }
            };

            spyOn(LoginComponentCtrl, 'fieldHasError').and.callThrough();
        });

        it('shuld exist', function () {
            expect(LoginComponentCtrl.fieldHasError).toBeDefined();
        });

        it('shuld return false if field is valid', function () {
            testField('field1', false);
            testField('field4', false);
        });

        it('shuld return true if field is invalid and was not touched', function () {
            testField('field2', true);
        });

        it('shuld return true if field is invalid and form was submitted', function () {
            LoginComponentCtrl.loginForm.$submitted = true;
            testField('field2', true);
            testField('field3', true);
        });
    });
});
