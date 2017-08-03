/* eslint-env node, jasmine */
'use strict';
describe('ReservedResources Service', function () {
    var reservedResourcesService;

    // Before each test load our common module
    beforeEach(angular.mock.module('common'));

    beforeEach(inject(function (_reservedResourcesService_) {
        reservedResourcesService = _reservedResourcesService_;
    }));

    // A simple test to verify the friendsService factory exists
    it('should exist', function () {
        expect(reservedResourcesService).toBeDefined();
    });

    describe('add', function () {
        beforeEach(function () {
            spyOn(reservedResourcesService, 'add').and.callThrough();
        });

        it('should exist', function () {
            expect(reservedResourcesService.add).toBeDefined();
        });

        it('should add a reserved resource', function () {
            reservedResourcesService.add(angular.noop);

            expect(reservedResourcesService.add).toHaveBeenCalled();
        });
    });

    describe('clear', function () {
        beforeEach(function () {
            spyOn(reservedResourcesService, 'clear').and.callThrough();
        });

        it('should exist', function () {
            expect(reservedResourcesService.clear).toBeDefined();
        });

        it('should clear all reserved resources', function () {
            reservedResourcesService.add(angular.noop);
            var result = reservedResourcesService.clear();

            expect(reservedResourcesService.clear).toHaveBeenCalled();
            expect(result.then instanceof Function).toEqual(true);
        });
    });
});
