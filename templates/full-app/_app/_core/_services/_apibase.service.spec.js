/* eslint-env node, jasmine */
'use strict';
describe('APIBase', function () {

    // Before each test load our api.core module
    beforeEach(angular.mock.module('app.core'));

    // A simple test to verify the APIBase factory exists
    it('should exist', inject(function (APIBase) {
        expect(APIBase).toBeDefined();
    }));

    describe('API url if relative === true', function () {
        beforeEach(function () {
            module(function ($provide) {
                $provide.constant('CoreConfig', {
                    API: {
                        relative: true,
                        protocol: 'http',
                        host: 'localhost',
                        port: '4000',
                        path: 'api'
                    }
                });
            });

        });

        it('should build relative url', inject(function (APIBase) {
            expect(APIBase).toEqual('api/');
        }));
    });

    describe('API url if relative === false', function () {
        beforeEach(function () {
            module(function ($provide) {
                $provide.constant('CoreConfig', {
                    API: {
                        relative: false,
                        protocol: 'http',
                        host: 'localhost',
                        port: '4000',
                        path: 'api'
                    }
                });
            });

        });

        it('should build absolute url', inject(function (APIBase) {
            expect(APIBase).toEqual('http://localhost:4000/api/');
        }));
    });
});
