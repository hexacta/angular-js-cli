/* eslint-env node, jasmine */
'use strict';
describe('<%=Name=%> Interceptor', function () {
    var <%=Name=%>Interceptor;

    // Before each test load our app.<%=module=%> module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('<%=module=%>'));

    /** Before each test set our injected <%=Name=%>Interceptor factory (_<%=Name=%>Interceptor_)
     *  to our local <%=Name=%>Interceptor variable
     */
    beforeEach(inject(function (_<%=Name=%>Interceptor_) {
        <%=Name=%>Interceptor = _<%=Name=%>Interceptor_;
    }));

    // A simple test to verify the <%=Name=%>Interceptor factory exists
    it('should exist', function () {
        expect(<%=Name=%>Interceptor).toBeDefined();
    });

    describe('request', function () {
        var config;
        // A simple test to verify the method all exists
        it('should exist', function () {
            config = {
                method: 'GET',
                url: 'some/url'
            };

            expect(<%=Name=%>Interceptor.request).toBeDefined();
        });

        it('should do something when request is from GET', function () {

            spyOn(<%=Name=%>Interceptor, 'request').and.callThrough();

            var result = <%=Name=%>Interceptor.request(config);

            expect(<%=Name=%>Interceptor.request).toHaveBeenCalledWith(config);

            expect(result).toEqual(config);
        });

        it('should do something else when request is not from GET', function () {
            config.method = 'POST';
            spyOn(<%=Name=%>Interceptor, 'request').and.callThrough();

            var result = <%=Name=%>Interceptor.request(config);

            expect(<%=Name=%>Interceptor.request).toHaveBeenCalledWith(config);

            expect(result).toEqual(config);
        });
    });

    describe('requestError', function () {
        var config;
        // A simple test to verify the method all exists
        it('should exist', function () {
            config = {
                method: 'GET',
                url: 'some/url'
            };

            expect(<%=Name=%>Interceptor.requestError).toBeDefined();
        });

        it('should do something when error from GET', function () {

            spyOn(<%=Name=%>Interceptor, 'requestError').and.callThrough();

            var result = <%=Name=%>Interceptor.requestError(config);

            expect(<%=Name=%>Interceptor.requestError).toHaveBeenCalledWith(config);

            expect(result).toEqual(config);
        });

        it('should do something else when error is not from GET', function () {
            config.method = 'POST';
            spyOn(<%=Name=%>Interceptor, 'requestError').and.callThrough();

            var result = <%=Name=%>Interceptor.requestError(config);

            expect(<%=Name=%>Interceptor.requestError).toHaveBeenCalledWith(config);

            expect(result).toEqual(config);
        });
    });

    describe('response', function () {
        var serverResponse, result;
        // A simple test to verify the method all exists
        it('should exist', function () {
            serverResponse = {
                status: 200,
                url: 'some/url'
            };

            expect(<%=Name=%>Interceptor.response).toBeDefined();
        });

        it('should do something when status is 200', function () {

            spyOn(<%=Name=%>Interceptor, 'response').and.callThrough();

            result = <%=Name=%>Interceptor.response(serverResponse);

            expect(<%=Name=%>Interceptor.response).toHaveBeenCalledWith(serverResponse);

            expect(result.then instanceof Function).toEqual(true);
        });

        it('should do something else when status is not 200', function () {
            serverResponse.status = 202;
            spyOn(<%=Name=%>Interceptor, 'response').and.callThrough();

            result = <%=Name=%>Interceptor.response(serverResponse);

            expect(<%=Name=%>Interceptor.response).toHaveBeenCalledWith(serverResponse);

            expect(result.then instanceof Function).toEqual(true);
        });
    });

    describe('responseError', function () {
        var serverResponse, result;
        // A simple test to verify the method all exists
        it('should exist', function () {
            serverResponse = {
                status: 500,
                url: 'some/url'
            };

            expect(<%=Name=%>Interceptor.responseError).toBeDefined();
        });

        it('should do something else when response error is 500', function () {

            spyOn(<%=Name=%>Interceptor, 'responseError').and.callThrough();

            result = <%=Name=%>Interceptor.responseError(serverResponse);

            expect(<%=Name=%>Interceptor.responseError).toHaveBeenCalledWith(serverResponse);

            expect(result.catch instanceof Function).toEqual(true);
        });

        it('should do something else when response error is not 500', function () {
            serverResponse.status = 403;
            spyOn(<%=Name=%>Interceptor, 'responseError').and.callThrough();

            result = <%=Name=%>Interceptor.responseError(serverResponse);

            expect(<%=Name=%>Interceptor.responseError).toHaveBeenCalledWith(serverResponse);

            expect(result.catch instanceof Function).toEqual(true);
        });
    });
});
