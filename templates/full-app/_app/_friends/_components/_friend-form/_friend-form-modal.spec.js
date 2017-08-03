/* eslint-env node, jasmine */
'use strict';
describe('FriendFormModal Component', function () {
    var $componentController, Friend, groups;

    // Before each test load our api.friends module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('app.friends'));
    beforeEach(angular.mock.module('modelMocks'));

    beforeEach(inject(function (_$componentController_, _Friend_, _groupMockService_) {
        $componentController = _$componentController_;
        Friend = _Friend_;
        groups = _groupMockService_.groups.data;
    }));

    describe('FriendFormModal Ctrl', function () {
        var bindings, FriendFormModalComponentCtrl;

        beforeEach(function () {
            bindings = {};
            FriendFormModalComponentCtrl = $componentController('friendFormModal',
                null, bindings);
        });

        it('should exist', function () {
            expect(FriendFormModalComponentCtrl).toBeDefined();
        });
    });

    describe('FriendFormModal Ctrl should have imports and exports', function () {
        var bindings, FriendFormModalComponentCtrl;

        beforeEach(function () {
            bindings = {
                close: function () {
                    return null;
                },
                dismiss: function () {
                    return null;
                },
                resolve: {
                    friend: new Friend(),
                    groups: groups
                }
            };

            FriendFormModalComponentCtrl = $componentController('friendFormModal',
                { }, bindings);
            spyOn(FriendFormModalComponentCtrl, '$onInit').and.callThrough();
        });

        it('Shuld have imports and export functions defined before $onInit', function () {
            expect(FriendFormModalComponentCtrl.resolve).toBeDefined();
            expect(FriendFormModalComponentCtrl.close instanceof Function).toEqual(true);
            expect(FriendFormModalComponentCtrl.dismiss instanceof Function).toEqual(true);

            expect(FriendFormModalComponentCtrl.cancel).toBeDefined();
            expect(FriendFormModalComponentCtrl.saveFriend).toBeDefined();

            expect(FriendFormModalComponentCtrl.isModal).not.toBeDefined();
            expect(FriendFormModalComponentCtrl.friend).not.toBeDefined();
            expect(FriendFormModalComponentCtrl.groups).not.toBeDefined();

            expect(FriendFormModalComponentCtrl.$onInit).not.toHaveBeenCalled();
        });

        it('Shuld have imports and export functions and vars defined after $onInit', function () {

            FriendFormModalComponentCtrl.$onInit();

            expect(FriendFormModalComponentCtrl.$onInit).toHaveBeenCalled();

            expect(FriendFormModalComponentCtrl.isModal).toBeDefined();
            expect(FriendFormModalComponentCtrl.friend).toBeDefined();
            expect(FriendFormModalComponentCtrl.groups).toBeDefined();
        });
    });

    describe('saveFriend', function () {
        var bindings, FriendFormModalComponentCtrl;

        beforeEach(function () {
            bindings = {
                close: function () {
                    return null;
                },
                dismiss: function () {
                    return null;
                },
                resolve: {
                    friend: new Friend(),
                    groups: groups
                }
            };

            FriendFormModalComponentCtrl = $componentController('friendFormModal',
                { }, bindings);

            spyOn(FriendFormModalComponentCtrl, 'saveFriend').and.callThrough();
            spyOn(FriendFormModalComponentCtrl, 'close').and.returnValue(true);

            FriendFormModalComponentCtrl.$onInit();
        });

        it('should exist', function () {
            expect(FriendFormModalComponentCtrl.saveFriend).toBeDefined();
        });

        it('Shuld call binding close method with a friend in $value', function () {

            FriendFormModalComponentCtrl.saveFriend();

            expect(FriendFormModalComponentCtrl.saveFriend).toHaveBeenCalled();
            expect(FriendFormModalComponentCtrl.close)
                .toHaveBeenCalledWith({ $value: FriendFormModalComponentCtrl.friend });
        });
    });

    describe('cancel', function () {
        var bindings, FriendFormModalComponentCtrl;

        beforeEach(function () {
            bindings = {
                close: function () {
                    return null;
                },
                dismiss: function () {
                    return null;
                },
                resolve: {
                    friend: new Friend(),
                    groups: groups
                }
            };

            FriendFormModalComponentCtrl = $componentController('friendFormModal',
                { }, bindings);

            spyOn(FriendFormModalComponentCtrl, 'cancel').and.callThrough();
            spyOn(FriendFormModalComponentCtrl, 'dismiss').and.returnValue(true);

            FriendFormModalComponentCtrl.$onInit();
        });

        it('should exist', function () {
            expect(FriendFormModalComponentCtrl.saveFriend).toBeDefined();
        });

        it('Shuld cancel modal with \'close\' in $value', function () {

            FriendFormModalComponentCtrl.cancel();

            expect(FriendFormModalComponentCtrl.cancel).toHaveBeenCalled();
            expect(FriendFormModalComponentCtrl.dismiss).toHaveBeenCalledWith({ $value: 'cancel' });
        });
    });
});
