/* eslint-env node, jasmine */
'use strict';
describe('CompareTo directive', function () {
    var $compile, $scope, compareToCtrl, compareToDirecetive;

    // Before each test load our common module
    beforeEach(angular.mock.module('common'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $scope.primaryModel = 'value2';
        $scope.equalModel = 'newValue';
        compareToDirecetive = getCompiledElement();
        compareToCtrl = compareToDirecetive.controller('compareTo');
    }));

    function getCompiledElement() {
        var element = angular.element('<input ng-model="equalModel" compare-to="primaryModel">');
        var compiledDirective = $compile(element)($scope);
        $scope.$digest();

        return compiledDirective;
    }

    describe('CompareTo Ctrl', function () {
        it('should exist', function () {
            expect(compareToCtrl).toBeDefined();
        });

        it('Shuld have imports defined', function () {
            expect(compareToCtrl.model).toBeDefined();
            expect(compareToCtrl.otherModelValue).toBeDefined();
            expect(compareToCtrl.ngModelCtrl).toBeDefined();
        });

        it('Shuld have exports defined', function () {
            expect(compareToCtrl.$onChanges instanceof Function).toEqual(true);
            expect(compareToCtrl.$onInit instanceof Function).toEqual(true);
            expect(compareToCtrl.validate instanceof Function).toEqual(true);
        });
    });

    describe('$onInit', function () {
        beforeEach(function () {
            spyOn(compareToCtrl, '$onInit').and.callThrough();
        });

        it('shuld exist', function () {
            expect(compareToCtrl.$onInit).toBeDefined();
        });

        it('shuld add validator to ng model ctrl', function () {
            compareToCtrl.$onInit();

            expect(compareToCtrl.$onInit).toHaveBeenCalled();
            expect(compareToCtrl.ngModelCtrl.$validators.compareTo).toBeDefined('value2');
        });
    });

    describe('$onChanges', function () {
        beforeEach(function () {
            spyOn(compareToCtrl.ngModelCtrl, '$validate').and.returnValue(true);
            spyOn(compareToCtrl, '$onChanges').and.callThrough();
        });

        it('shuld exist', function () {
            expect(compareToCtrl.$onChanges).toBeDefined();
        });

        it('shuld validate after changes', function () {
            compareToCtrl.$onInit();
            $scope.primaryModel = 'value3';
            $scope.$apply();

            expect(compareToCtrl.$onChanges).toHaveBeenCalled();
            expect(compareToCtrl.ngModelCtrl.$validate).toHaveBeenCalled();
        });

        it('shuld not validate if only model changes', function () {
            compareToCtrl.$onInit();
            $scope.equalModel = 'value3';
            $scope.$apply();

            expect(compareToCtrl.$onChanges).toHaveBeenCalled();
            expect(compareToCtrl.ngModelCtrl.$validate).not.toHaveBeenCalled();
        });
    });

    describe('validate', function () {
        var result;
        beforeEach(function () {
            spyOn(compareToCtrl, 'validate').and.callThrough();
        });

        it('shuld exist', function () {
            expect(compareToCtrl.validate).toBeDefined();
        });

        it('shuld return true if model equals compare to value', function () {
            compareToCtrl.$onInit();
            result = compareToCtrl.validate('value2');

            expect(compareToCtrl.validate).toHaveBeenCalledWith('value2');
            expect(result).toEqual(true);
        });

        it('shuld return false if model equals compare to value', function () {
            compareToCtrl.$onInit();
            result = compareToCtrl.validate('value3');

            expect(compareToCtrl.validate).toHaveBeenCalledWith('value3');
            expect(result).toEqual(false);
        });
    });
});