/* eslint-env node, jasmine */
'use strict';
describe('<%=Name=%> Component', function () {
    var $componentController, <%=Module=%>Messages;

    // Before each test load our api.<%=module=%> module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('<%=module=%>'));
    beforeEach(angular.mock.module('modelMocks'));

    beforeEach(inject(function (_$rootScope_, _$componentController_, _<%=Module=%>Messages_) {
        $componentController = _$componentController_;
        <%=Module=%>Messages = _<%=Module=%>Messages_;
    }));

    describe('<%=Name=%> Ctrl', function () {
        var bindings, <%=Name=%>ComponentCtrl;

        beforeEach(function () {
            bindings = {};
            <%=Name=%>ComponentCtrl = $componentController('<%=name=%>',
                null, bindings);
        });

        it('should exist', function () {
            expect(<%=Name=%>ComponentCtrl).toBeDefined();
        });
    });

    describe('<%=Name=%> Ctrl to have imports and exports defined', function () {
        var bindings, <%=Name=%>ComponentCtrl;

        beforeEach(function () {
            bindings = {
                aFunctionBinding: function() {
                    return true;
                },
                anObjectBinding: { name: 'Object' },
                aStringBinding: 'A String'
            };

            <%=Name=%>ComponentCtrl = $componentController('<%=name=%>',
                { <%=Module=%>Messages: <%=Module=%>Messages }, bindings);
            spyOn(<%=Name=%>ComponentCtrl, '$onInit').and.callThrough();
        });

        it('Shuld have imports and exports binded but no ctrl.objectC', function () {
            expect(<%=Name=%>ComponentCtrl.aFunctionBinding instanceof Function).toEqual(true);
            expect(<%=Name=%>ComponentCtrl.anObjectBinding.name).toEqual('Object');
            expect(<%=Name=%>ComponentCtrl.aStringBinding).toEqual('A String');

            expect(<%=Name=%>ComponentCtrl.objectA).toBeDefined();
            expect(<%=Name=%>ComponentCtrl.objectB).toEqual(5);

            expect(<%=Name=%>ComponentCtrl.myFunctionA instanceof Function).toEqual(true);
            expect(<%=Name=%>ComponentCtrl.myFunctionB instanceof Function).toEqual(true);

            expect(<%=Name=%>ComponentCtrl.objectC).not.toBeDefined();
            expect(<%=Name=%>ComponentCtrl.$onInit).not.toHaveBeenCalled();
        });

        it('Shuld have set ctrl.objectC after $onInit', function () {
            expect(<%=Name=%>ComponentCtrl.objectC).not.toBeDefined();

            <%=Name=%>ComponentCtrl.$onInit();

            expect(<%=Name=%>ComponentCtrl.objectC).toEqual('hello ' + <%=Module=%>Messages.namespace);
        });
    });

    describe('myFunctionA ', function () {
        var bindings, <%=Name=%>ComponentCtrl;

        beforeEach(function () {
            bindings = {};

            <%=Name=%>ComponentCtrl = $componentController('<%=name=%>', null, bindings);
            spyOn(<%=Name=%>ComponentCtrl, 'myFunctionA').and.callThrough();
            <%=Name=%>ComponentCtrl.$onInit();
        });

        it('should change objectB properly', function () {
            expect(<%=Name=%>ComponentCtrl.objectB).toEqual(5);

            <%=Name=%>ComponentCtrl.myFunctionA();

            expect(<%=Name=%>ComponentCtrl.objectB).toEqual('world');
        });
    });

    describe('myFunctionB', function () {
        var bindings, <%=Name=%>ComponentCtrl;

        beforeEach(function () {
            bindings = {};

            <%=Name=%>ComponentCtrl = $componentController('<%=name=%>', null, bindings);
            spyOn(<%=Name=%>ComponentCtrl, 'myFunctionB').and.callThrough();
            <%=Name=%>ComponentCtrl.$onInit();
        });

        it('should change objectB properly', function () {
            expect(<%=Name=%>ComponentCtrl.objectB).toEqual(5);

            <%=Name=%>ComponentCtrl.myFunctionB();

            expect(<%=Name=%>ComponentCtrl.objectB).toEqual('World');
        });
    });
});
