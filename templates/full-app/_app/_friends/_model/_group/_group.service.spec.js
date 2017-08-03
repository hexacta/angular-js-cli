/* eslint-env node, jasmine */
'use strict';
describe('Group', function () {
    var $httpBackend, Group, groupMockService, mocksHelper;

    // Before each test load our api.friends module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('app.friends'));
    beforeEach(angular.mock.module('modelMocks'));

    beforeEach(inject(function (_$httpBackend_, _groupMockService_, _Group_, _mocksHelper_) {
        $httpBackend = _$httpBackend_;
        Group = _Group_;
        groupMockService = _groupMockService_;
        mocksHelper = _mocksHelper_;
    }));

    /* replace:session:remove */
    beforeEach(inject(function (_Friend_) {
        spyOn(_Friend_, 'query').and.returnValue([]);
    }));
    /* endreplace:session:remove */
    beforeEach(function () {
        mocksHelper.addMocks(groupMockService.APIMethods);
    });

    // A simple test to verify the groupsService factory exists
    it('should exist', function () {
        expect(Group).toBeDefined();
    });
    describe('get', function () {
        it('should exist', function () {
            expect(Group.get).toBeDefined();
        });

        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Group, 'get').and.callThrough();
        });

        afterEach(function () {
            expect(groupMockService.groups.data.length).toEqual(2);
        });

        it('should return a Group when called with a valid id', function () {
            var id = 1;

            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            expect(Group.get).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = Group.get({ id: id });

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(Group.get).toHaveBeenCalledWith({ id: id });
            expect(result instanceof Group).toEqual(true);
            expect(result.id).toEqual(1);
            expect(result.name).toEqual('Family');
        });

        it('should return a 404 when called with an invalid id', function () {
            var id = 12;

            expect(Group.get).not.toHaveBeenCalled();
            expect(result).toEqual({});

            Group.get({ id: id }).$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(Group.get).toHaveBeenCalledWith({ id: id });
            expect(result.error).toEqual('Not found');
        });
    });

    describe('query', function () {
        it('should exist', function () {
            expect(Group.query).toBeDefined();
        });

        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Group, 'query').and.callThrough();
        });

        it('should return all Groups when called', function () {

            expect(Group.query).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = Group.query();

            $httpBackend.flush();


            expect(Group.query).toHaveBeenCalled();
            expect(groupMockService.groups.data.length).toEqual(2);
            expect(result instanceof Array).toEqual(true);
            expect(result.length).toEqual(2);

            var group = result[0];
            expect(group instanceof Group).toEqual(true);
            expect(group.id).toEqual(1);
            expect(group.name).toEqual('Family');
        });

        it('should return a 404 when no results found', function () {
            var RESPONSE_ERROR = { 'error': 'None found' };

            var method = groupMockService.APIMethods.query;
            $httpBackend.expect(method.method, method.url)
                .respond(404, RESPONSE_ERROR);

            expect(Group.query).not.toHaveBeenCalled();
            expect(result).toEqual({});

            Group.query().$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(Group.query).toHaveBeenCalled();
            expect(result.error).toEqual('None found');
        });
    });

});
