/* eslint-env node, jasmine */
'use strict';
describe('orderObjectBy filter', function () {
    var $filter, result;
    var objects = [
        {
            property1: 'a',
            property2: 4
        },
        {
            property1: 'b',
            property2: 2
        },
        {
            property1: 'c',
            property2: 1
        },
        {
            property1: 'd',
            property2: 3
        }
    ];

    // Before each test load our api.widgets module
    beforeEach(angular.mock.module('app.widgets'));

    beforeEach(inject(function (_$filter_) {
        $filter = _$filter_;
    }));

    it('should order an array of objects by a certain property', function () {
        var property = 'property2';
        var reverse = false;

        result = $filter('orderObjectBy')(objects, property, reverse);

        expect(result[0][property]).toEqual(1);
        expect(result[1][property]).toEqual(2);
        expect(result[2][property]).toEqual(3);
        expect(result[3][property]).toEqual(4);
    });

    it('should reverse order an array of objects by a certain property and reverse = true', function () {
        var property = 'property1';
        var reverse = true;

        result = $filter('orderObjectBy')(objects, property, reverse);

        expect(result[0][property]).toEqual('d');
        expect(result[1][property]).toEqual('c');
        expect(result[2][property]).toEqual('b');
        expect(result[3][property]).toEqual('a');
    });
});