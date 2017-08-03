/* eslint-env node, jasmine */
'use strict';
describe('Group Service', function () {
    var Group, groupsService, groupMockService, groups;

    // Before each test load our api.friends module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('app.friends'));
    beforeEach(angular.mock.module('modelMocks'));

    // Before each test set our injected groupsService factory (_groupsService_)
    // to our local groupsService variable
    beforeEach(inject(function (_Group_, _groupsService_, _groupMockService_) {
        Group = _Group_;
        groupsService = _groupsService_;
        groupMockService = _groupMockService_;
        groups = groupMockService.groups.data;
    }));

    // A simple test to verify the groupsService factory exists
    it('should exist', function () {
        expect(groupsService).toBeDefined();
    });

    describe('get', function () {
        // A simple test to verify the method all exists
        it('should exist', function () {
            expect(groupsService.get).toBeDefined();
        });

        it('should return a hard-coded group', function () {
            var id = 1;
            spyOn(Group, 'get').and.callFake(function () {
                return groups[1];
            });
            spyOn(groupsService, 'get').and.callThrough();

            var result = groupsService.get(id);

            expect(Group.get).toHaveBeenCalledWith({ id: id });
            expect(groupsService.get).toHaveBeenCalledWith(id);

            expect(result).toEqual(groups[1]);

            expect(result instanceof Group).toEqual(true);
            expect(result.id).toEqual(2);
            expect(result.name).toEqual('Club');
        });
    });

    describe('getAll', function () {
        // A simple test to verify the method all exists
        it('should exist', function () {
            expect(groupsService.getAll).toBeDefined();
        });

        it('should return a hard-coded list of groups', function () {
            spyOn(Group, 'query').and.callFake(function () {
                return groups;
            });
            spyOn(groupsService, 'getAll').and.callThrough();

            var result = groupsService.getAll();

            expect(Group.query).toHaveBeenCalled();
            expect(groupsService.getAll).toHaveBeenCalled();

            expect(result).toEqual(groups);
            expect(result instanceof Array).toEqual(true);

            var group = result[0];
            expect(group instanceof Group).toEqual(true);
            expect(group.id).toEqual(1);
            expect(group.name).toEqual('Family');
        });
    });
});
