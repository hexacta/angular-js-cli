/* eslint-env node, jasmine */
'use strict';
describe('ChangePassword Component', function () {
    var $scope, $componentController, $q, ChangePasswordComponentCtrl, injection,
        sessionService, SessionMessages, popupService, loadingService;

    // Before each test load our api.session module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('app.session'));

    beforeEach(inject(function (_$rootScope_, _$componentController_, _$q_, _sessionService_,
        _SessionMessages_, _popupService_, _loadingService_) {
        $componentController = _$componentController_;
        $q = _$q_;
        sessionService = _sessionService_;
        SessionMessages = _SessionMessages_;
        popupService = _popupService_;
        loadingService = _loadingService_;
        $scope = _$rootScope_.$new();
    }));

    beforeEach(function () {
        injection = {
            sessionService: sessionService,
            popupService: popupService,
            SessionMessages: SessionMessages,
            loadingService: loadingService
        };
        ChangePasswordComponentCtrl = $componentController('changePassword',
            injection, null);
    });

    beforeEach(function () {
        spyOn(loadingService, 'show').and.returnValue($q.resolve());
        spyOn(loadingService, 'hide').and.returnValue($q.resolve());
        spyOn(popupService, 'getPopup').and.returnValue($q.resolve(true));
    });

    describe('ChangePassword Ctrl', function () {
        it('should exist', function () {
            expect(ChangePasswordComponentCtrl).toBeDefined();
        });

        it('Shuld have exports defined', function () {
            expect(ChangePasswordComponentCtrl.user).toBeDefined();
            expect(ChangePasswordComponentCtrl.changePassword).toBeDefined();
            expect(ChangePasswordComponentCtrl.fieldHasError).toBeDefined();
        });
    });

    describe('changePassword', function () {
        beforeEach(function () {
            ChangePasswordComponentCtrl.changePasswordForm = { $valid: true };

            spyOn(sessionService, 'changePassword').and.returnValue($q.reject());

            spyOn(ChangePasswordComponentCtrl, 'changePassword').and.callThrough();
        });

        it('shuld exist', function () {
            expect(ChangePasswordComponentCtrl.changePassword).toBeDefined();
        });

        it('shuld fail if form is not valid', function () {
            ChangePasswordComponentCtrl.changePasswordForm = { $valid: false };

            ChangePasswordComponentCtrl.changePassword();

            expect(popupService.getPopup).toHaveBeenCalledWith('session.invalidDataError');
            expect(loadingService.show).not.toHaveBeenCalled();
            expect(sessionService.changePassword).not.toHaveBeenCalled();
        });

        it('shuld fail if form is valid but the service validation fails', function () {
            ChangePasswordComponentCtrl.changePassword();
            $scope.$apply();

            expect(loadingService.show).toHaveBeenCalled();
            expect(sessionService.changePassword).toHaveBeenCalled();
            expect(popupService.getPopup).toHaveBeenCalledWith('session.invalidCredentialsError');
            expect(loadingService.hide).toHaveBeenCalled();
        });

        it('shuld succeed if form is valid but the service validation succeeds', function () {
            spyOn(sessionService, 'goToLogin').and.returnValue(true);
            sessionService.changePassword.and.returnValue($q.resolve());

            ChangePasswordComponentCtrl.changePassword();
            $scope.$apply();

            expect(loadingService.show).toHaveBeenCalled();
            expect(sessionService.changePassword).toHaveBeenCalled();
            expect(popupService.getPopup).not.toHaveBeenCalled();
            expect(loadingService.hide).toHaveBeenCalled();
            expect(sessionService.goToLogin).toHaveBeenCalled();
        });
    });

    describe('fieldHasError', function () {

        function testField(field, expectValue) {
            var result = ChangePasswordComponentCtrl.fieldHasError(field);

            expect(ChangePasswordComponentCtrl.fieldHasError).toHaveBeenCalledWith(field);
            expect(result).toEqual(expectValue);
        }

        beforeEach(function () {
            ChangePasswordComponentCtrl.changePasswordForm = {
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

            spyOn(ChangePasswordComponentCtrl, 'fieldHasError').and.callThrough();
        });

        it('shuld exist', function () {
            expect(ChangePasswordComponentCtrl.fieldHasError).toBeDefined();
        });

        it('shuld return false if field is valid', function () {
            testField('field1', false);
            testField('field4', false);
        });

        it('shuld return true if field is invalid and was not touched', function () {
            testField('field2', true);
        });

        it('shuld return true if field is invalid and form was submitted', function () {
            ChangePasswordComponentCtrl.changePasswordForm.$submitted = true;
            testField('field2', true);
            testField('field3', true);
        });
    });
});
