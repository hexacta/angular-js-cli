/* eslint-env node, jasmine */
'use strict';
describe('SmartFloat directive', function () {
    var $compile, $scope, smartFloatDirecetive, ngModel;

    // Before each test load our common module
    beforeEach(angular.mock.module('common'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $scope.smartNumber = 21;
        smartFloatDirecetive = getCompiledElement('<input type="number" ng-model="smartNumber" smart-float>');
    }));

    function getCompiledElement(template) {
        var element = angular.element(template);
        var compiledDirective = $compile(element)($scope);
        $scope.$digest();

        return compiledDirective;
    }

    it('should add .00 with default regex to integer', function () {
        ngModel = smartFloatDirecetive.controller('ngModel');

        expect($scope.smartNumber).toEqual(21);
        expect(ngModel.$viewValue).toEqual('21.00');
    });

    it('should add a 0 with default regex to float with 1 decimal', function () {
        ngModel = smartFloatDirecetive.controller('ngModel');

        expect($scope.smartNumber).toEqual(21);
        expect(ngModel.$viewValue).toEqual('21.00');

        $scope.smartNumber = 76.8;
        $scope.$digest();
        expect($scope.smartNumber).toEqual(76.8);
        expect(ngModel.$viewValue).toEqual('76.80');
    });

    it('should remove decimals until only 2 are left', function () {
        ngModel = smartFloatDirecetive.controller('ngModel');

        expect($scope.smartNumber).toEqual(21);
        expect(ngModel.$viewValue).toEqual('21.00');

        $scope.smartNumber = 76.81935;
        angular.forEach(ngModel.$parsers, function (parser) {
            parser(ngModel.$viewValue);
        });
        $scope.$digest();

        expect($scope.smartNumber).toEqual(76.81935);
        expect(ngModel.$viewValue).toEqual('76.82');
    });

    it('should fail if input is not a number', function () {
        smartFloatDirecetive = getCompiledElement('<input type="text" ng-model="smartNumber" smart-float>');
        ngModel = smartFloatDirecetive.controller('ngModel');

        $scope.$digest();

        expect($scope.smartNumber).toEqual(21);
        expect(ngModel.$viewValue).toEqual('21');
    });

    it('should fail if input is not a number', function () {
        var template = '<form name="form">' +
            '<input name="smart" type="number" ng-model="smartNumber" smart-float="regex">' +
            '</form>';
        smartFloatDirecetive = getCompiledElement(template);
        $scope.form.smart.$setViewValue('123,90');

        $scope.$digest();

        expect($scope.form.smart.$valid).toEqual(false);
        expect($scope.form.smart.$error.float).toEqual(true);
    });

});