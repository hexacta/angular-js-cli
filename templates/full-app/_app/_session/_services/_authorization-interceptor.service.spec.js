/* eslint-env node, jasmine */
'use strict';
describe('Authorization Interceptor', function () {
    var $q, AuthorizationInterceptor, sessionService;

    // Before each test load our api.session module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('app.session'));

    beforeEach(inject(function (_$injector_, _$q_, _AuthorizationInterceptor_, _sessionService_) {
        $q = _$q_;
        AuthorizationInterceptor = _AuthorizationInterceptor_;
        sessionService = _sessionService_;
    }));


    // A simple test to verify the friendsService factory exists
    it('should exist', function () {
        expect(AuthorizationInterceptor).toBeDefined();
    });

    describe('responseError', function () {
        var rejection;

        beforeEach(function () {
            rejection = {
                data: {},
                status: 401,
                config: {},
                statusText: 'Not Found',
                headers: function () {
                    return null;
                }
            };

            spyOn(sessionService, 'handleTimeout').and.returnValue($q.reject(rejection));

            spyOn(AuthorizationInterceptor, 'responseError').and.callThrough();
        });

        it('should exist', function () {
            expect(AuthorizationInterceptor.responseError).toBeDefined();
        });

        it('should pass thorugh if status !== 401', function () {

            function testWithCode(code) {
                rejection.status = code;
                AuthorizationInterceptor.responseError(rejection);

                expect(AuthorizationInterceptor.responseError).toHaveBeenCalledWith(rejection);
                expect(sessionService.handleTimeout).not.toHaveBeenCalled();
            }
            testWithCode(300);
            testWithCode(402);
            testWithCode(403);
            testWithCode(404);
            testWithCode(500);
        });

        it('should handle timeout if status === 401', function () {
            AuthorizationInterceptor.responseError(rejection);

            expect(AuthorizationInterceptor.responseError).toHaveBeenCalledWith(rejection);
            expect(sessionService.handleTimeout).toHaveBeenCalledWith(rejection);
        });
    });

    describe('request', function () {
        var request;

        beforeEach(function () {
            request = { method: 'GET' };

            spyOn(sessionService, 'isLoggedIn').and.returnValue(true);
            spyOn(sessionService, 'refreshTimer').and.returnValue(true);

            spyOn(AuthorizationInterceptor, 'request').and.callThrough();
        });

        it('should exist', function () {
            expect(AuthorizationInterceptor.request).toBeDefined();
        });

        it('should refresh timer if request is GET and not cached', function () {
            AuthorizationInterceptor.request(request);

            expect(AuthorizationInterceptor.request).toHaveBeenCalledWith(request);
            expect(sessionService.isLoggedIn).toHaveBeenCalled();
            expect(sessionService.refreshTimer).toHaveBeenCalled();
        });

        it('should not refresh timer if no user is logged in', function () {
            sessionService.isLoggedIn.and.returnValue(false);
            AuthorizationInterceptor.request(request);

            expect(AuthorizationInterceptor.request).toHaveBeenCalledWith(request);
            expect(sessionService.isLoggedIn).toHaveBeenCalled();
            expect(sessionService.refreshTimer).not.toHaveBeenCalled();
        });

        it('should not refresh timer if request is not GET', function () {
            request = { method: 'POST' };
            AuthorizationInterceptor.request(request);

            expect(AuthorizationInterceptor.request).toHaveBeenCalledWith(request);
            expect(sessionService.isLoggedIn).not.toHaveBeenCalled();
            expect(sessionService.refreshTimer).not.toHaveBeenCalled();
        });

        it('should not refresh timer if request is GET but cached', function () {
            request.cache = {
                get: function () {
                    return true;
                }
            };
            AuthorizationInterceptor.request(request);

            expect(AuthorizationInterceptor.request).toHaveBeenCalledWith(request);
            expect(sessionService.isLoggedIn).not.toHaveBeenCalled();
            expect(sessionService.refreshTimer).not.toHaveBeenCalled();
        });
    });
});
