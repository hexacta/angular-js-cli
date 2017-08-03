/* eslint-env node, jasmine */
'use strict';
describe('Http Interceptor', function () {
    var $q, HttpInterceptor, popupService;

    // Before each test load our api.core module
    beforeEach(angular.mock.module('app.core'));

    beforeEach(inject(function (_$injector_, _$q_, _HttpInterceptor_, _popupService_) {
        $q = _$q_;
        HttpInterceptor = _HttpInterceptor_;
        popupService = _popupService_;
    }));

    // A simple test to verify the friendsService factory exists
    it('should exist', function () {
        expect(HttpInterceptor).toBeDefined();
    });

    describe('responseError', function () {
        var rejection;

        beforeEach(function () {
            rejection = {
                data: {},
                status: 500,
                config: {},
                statusText: 'Not Found',
                headers: function () {
                    return null;
                }
            };

            spyOn(popupService, 'getPopup').and.returnValue($q.reject(rejection));

            spyOn(HttpInterceptor, 'responseError').and.callThrough();
        });

        it('should exist', function () {
            expect(HttpInterceptor.responseError).toBeDefined();
        });

        it('should pass thorugh if status !== 500', function () {

            function testWithCode(code) {
                rejection.status = code;
                HttpInterceptor.responseError(rejection);

                expect(HttpInterceptor.responseError).toHaveBeenCalledWith(rejection);
                expect(popupService.getPopup).not.toHaveBeenCalled();
            }

            testWithCode(300);
            testWithCode(401);
            testWithCode(402);
            testWithCode(403);
            testWithCode(404);
        });

        it('should show a general error if status === 500 and rejection has no data', function () {
            HttpInterceptor.responseError(rejection);

            expect(HttpInterceptor.responseError).toHaveBeenCalledWith(rejection);
            expect(popupService.getPopup).toHaveBeenCalledWith('core.generalError');
        });

        it('should show an error with id param if status === 500 and rejection has an error message id', function () {
            rejection.data = {
                message: 'displayThisError',
                id: '123-456-789'
            };
            HttpInterceptor.responseError(rejection);

            expect(HttpInterceptor.responseError).toHaveBeenCalledWith(rejection);
            expect(popupService.getPopup).toHaveBeenCalledWith('core.displayThisError', null, ['123-456-789']);
        });

        it('should show an error with no id if status === 500 and rejection has an error message but no id',
            function () {
                rejection.data = { message: 'displayThisError' };
                HttpInterceptor.responseError(rejection);

                expect(HttpInterceptor.responseError).toHaveBeenCalledWith(rejection);
                expect(popupService.getPopup).toHaveBeenCalledWith('core.displayThisError');
            });
    });
});
