/* eslint-env node, jasmine */
'use strict';
describe('Storage Service', function () {
    var storageService, $localStorage;
    var storage = {};
    var storageMock = {
        setItem: function (key, value) {
            storage[key] = value || '';
        },
        getItem: function (key) {
            return key in storage ? storage[key] : null;
        },
        removeItem: function (key) {
            delete storage[key];
        },
        key: function (i) {
            var keys = Object.keys(storage);

            return keys[i] || null;
        }
    };

    // Before each test load our common module
    beforeEach(angular.mock.module('common'));

    beforeEach(function () {
        module(function ($provide) {
            // eslint-disable-next-line custom-file-names
            $provide.constant('$localStorage', storageMock);
        });
    });

    beforeEach(inject(function (_$localStorage_, _storageService_) {
        $localStorage = _$localStorage_;
        storageService = _storageService_;
    }));

    // A simple test to verify the friendsService factory exists
    it('should exist', function () {
        expect(storageService).toBeDefined();
    });

    describe('clear', function () {
        beforeEach(function () {
            spyOn($localStorage, 'removeItem').and.callThrough();

            spyOn(storageService, 'clear').and.callThrough();
        });

        it('should exist', function () {
            expect(storageService.clear).toBeDefined();
        });

        it('should clear a local storage item', function () {

            storageService.clear('someItem');

            expect(storageService.clear).toHaveBeenCalledWith('someItem');
            expect($localStorage.removeItem).toHaveBeenCalledWith('someItem');
        });
    });

    describe('exists', function () {
        beforeEach(function () {
            spyOn(storageService, 'exists').and.callThrough();
        });

        it('should exist', function () {
            expect(storageService.clear).toBeDefined();
        });

        it('should return true if item exists', function () {
            spyOn($localStorage, 'getItem').and.returnValue('value');

            var result = storageService.exists('someItem');

            expect(storageService.exists).toHaveBeenCalledWith('someItem');
            expect($localStorage.getItem).toHaveBeenCalledWith('someItem');

            expect(result).toEqual(true);
        });

        it('should return false if item does not exist', function () {
            spyOn($localStorage, 'getItem').and.returnValue(null);

            var result = storageService.exists('someItem');

            expect(storageService.exists).toHaveBeenCalledWith('someItem');
            expect($localStorage.getItem).toHaveBeenCalledWith('someItem');

            expect(result).toEqual(false);
        });
    });

    describe('load', function () {
        beforeEach(function () {
            spyOn(storageService, 'load').and.callThrough();
        });

        it('should exist', function () {
            expect(storageService.load).toBeDefined();
        });

        it('should return items\' value if it exists', function () {
            spyOn($localStorage, 'getItem').and.returnValue(JSON.stringify('value'));

            var result = storageService.load('someItem');

            expect(storageService.load).toHaveBeenCalledWith('someItem');
            expect($localStorage.getItem).toHaveBeenCalledWith('someItem');

            expect(result).toEqual('value');
        });

        it('should return null if it does not exist', function () {
            spyOn($localStorage, 'getItem').and.returnValue(JSON.stringify(null));

            var result = storageService.load('someItem');

            expect(storageService.load).toHaveBeenCalledWith('someItem');
            expect($localStorage.getItem).toHaveBeenCalledWith('someItem');

            expect(result).toEqual(null);
        });
    });

    describe('save', function () {
        beforeEach(function () {
            spyOn(storageService, 'save').and.callThrough();
        });

        it('should exist', function () {
            expect(storageService.save).toBeDefined();
        });

        it('should save a value to the local storage', function () {
            spyOn($localStorage, 'setItem').and.returnValue();

            storageService.save('someItem', 'value');

            expect(storageService.save).toHaveBeenCalledWith('someItem', 'value');
            expect($localStorage.setItem).toHaveBeenCalledWith('someItem', JSON.stringify('value'));
        });
    });
});
