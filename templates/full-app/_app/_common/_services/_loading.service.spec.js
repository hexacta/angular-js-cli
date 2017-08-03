/* eslint-env node, jasmine */
'use strict';
describe('Loading Service', function () {
    var $q, $scope, $uibModal, loadingService;

    // Before each test load our common module
    beforeEach(angular.mock.module('common'));

    beforeEach(inject(function (_$rootScope_, _$q_, _$uibModal_, _loadingService_) {
        $q = _$q_;
        $scope = _$rootScope_.$new();
        $uibModal = _$uibModal_;
        loadingService = _loadingService_;
    }));

    // A simple test to verify the friendsService factory exists
    it('should exist', function () {
        expect(loadingService).toBeDefined();
    });

    describe('show', function () {
        var message = 'Loading...';

        beforeEach(function () {
            spyOn($uibModal, 'open').and.returnValue({ opened: $q.defer().promise });

            spyOn(loadingService, 'show').and.callThrough();
        });

        it('should exist', function () {
            expect(loadingService.show).toBeDefined();
        });

        it('should open a loading modal with default message', function () {
            var result = loadingService.show();

            expect(loadingService.show).toHaveBeenCalled();
            expect($uibModal.open).toHaveBeenCalled();
            expect(result).toBeDefined();
        });

        it('should open a loading modal with sent message', function () {
            var result = loadingService.show(message);

            expect(loadingService.show).toHaveBeenCalledWith(message);
            expect($uibModal.open).toHaveBeenCalled();
            expect(result.then instanceof Function).toEqual(true);
        });
    });

    describe('hide', function () {
        var promise, response;

        beforeEach(function () {
            response = true;
            promise = {
                dismiss: angular.noop,
                opened: $q.resolve()
            };

            spyOn($uibModal, 'open').and.returnValue(promise);
            spyOn(loadingService, 'show').and.callThrough();
            spyOn(promise, 'dismiss').and.callThrough();

            spyOn(loadingService, 'hide').and.callThrough();
        });

        it('should exist', function () {
            expect(loadingService.hide).toBeDefined();
        });

        it('should attempt to close a non existing loading modal', function () {
            var result = loadingService.hide(response);

            expect(loadingService.hide).toHaveBeenCalledWith(response);
            expect(result.then instanceof Function).toEqual(true);
        });

        it('should attempt to close an existing loading modal', function () {
            loadingService.show();
            $scope.$apply();

            var result = loadingService.hide(response);

            expect(loadingService.hide).toHaveBeenCalledWith(response);
            expect(promise.dismiss).toHaveBeenCalledWith('cancel');
            expect(result.then instanceof Function).toEqual(true);
        });
    });
});
