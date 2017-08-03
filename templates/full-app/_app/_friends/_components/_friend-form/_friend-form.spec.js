/* eslint-env node, jasmine */
'use strict';
describe('FriendForm Component', function () {
    var $scope, $componentController, $q,
        Friend, popupService, friendsService, loadingService, groupMockService, friendMockService;

    // Before each test load our api.friends module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('app.friends'));
    beforeEach(angular.mock.module('modelMocks'));

    beforeEach(inject(function (_$rootScope_, _$componentController_, _Friend_, _popupService_,
        _friendsService_, _loadingService_, _friendMockService_, _groupMockService_, _$q_) {
        $componentController = _$componentController_;
        Friend = _Friend_;
        popupService = _popupService_;
        friendsService = _friendsService_;
        loadingService = _loadingService_;
        groupMockService = _groupMockService_;
        friendMockService = _friendMockService_;
        $q = _$q_;
        $scope = _$rootScope_.$new();
    }));

    /* replace:session:remove */
    beforeEach(function () {
        spyOn(Friend, 'query').and.returnValue([]);
    });
    /* endreplace:session:remove */
    describe('FriendForm Ctrl', function () {
        var bindings, FriendFormComponentCtrl;

        beforeEach(function () {
            bindings = {};
            FriendFormComponentCtrl = $componentController('friendForm',
                null, bindings);
        });

        it('should exist', function () {
            expect(FriendFormComponentCtrl).toBeDefined();
        });
    });

    describe('FriendForm Ctrl to Create Friend (empty friend and valid groups)', function () {
        var bindings, FriendFormComponentCtrl;

        beforeEach(function () {
            bindings = { groups: groupMockService.groups.data };

            spyOn(friendsService, 'newFriend').and.callFake(function () {
                var friend = { name: '', group: 'Club' };

                return new Friend(friend);
            });

            FriendFormComponentCtrl = $componentController('friendForm',
                {
                    popupService: popupService,
                    friendsService: friendsService,
                    loadingService: loadingService
                }, bindings);
            spyOn(FriendFormComponentCtrl, '$onInit').and.callThrough();
        });

        it('Shuld have groups binded and friend undefined', function () {
            expect(FriendFormComponentCtrl.friend).not.toBeDefined();
            expect(FriendFormComponentCtrl.groups).toBeDefined();
            expect(FriendFormComponentCtrl.groups.length).toEqual(2);
            expect(FriendFormComponentCtrl.groups[0].name).toEqual('Family');
            expect(FriendFormComponentCtrl.$onInit).not.toHaveBeenCalled();
        });

        it('Shuld expose a friend object and mask setting after $onInit', function () {
            expect(FriendFormComponentCtrl.friend).not.toBeDefined();

            FriendFormComponentCtrl.$onInit();

            expect(FriendFormComponentCtrl.friend).toBeDefined();
            expect(FriendFormComponentCtrl.friend.name).toEqual('');
            expect(FriendFormComponentCtrl.friend.group).toEqual('Club');
        });
    });

    describe('FriendForm Ctrl to Edit Friend (valid friend and valid groups)', function () {
        var friend, bindings, FriendFormComponentCtrl;

        beforeEach(function () {
            friend = angular.copy(friendMockService.friends.data[1]);
            bindings = {
                friend: friend,
                groups: angular.copy(groupMockService.groups.data)
            };

            spyOn(friendsService, 'newFriend').and.callFake(function () {
                var friend = { name: '', group: 'Club' };

                return new Friend(friend);
            });

            FriendFormComponentCtrl = $componentController('friendForm',
                {
                    friendsService: friendsService
                }, bindings);
            spyOn(FriendFormComponentCtrl, '$onInit').and.callThrough();
        });

        it('Shuld expose groups and friend objects', function () {
            expect(FriendFormComponentCtrl.friend).toBeDefined();
            expect(FriendFormComponentCtrl.groups).toBeDefined();
            expect(FriendFormComponentCtrl.groups.length).toEqual(2);
            expect(FriendFormComponentCtrl.groups[0].name).toEqual('Family');

            expect(FriendFormComponentCtrl.friend.id).toEqual(2);
            expect(FriendFormComponentCtrl.friend.name).toEqual('Arya Stark');
            expect(FriendFormComponentCtrl.friend.getFirstName()).toEqual('Arya');
            expect(FriendFormComponentCtrl.friend.group).toEqual('Club');

            expect(FriendFormComponentCtrl.$onInit).not.toHaveBeenCalled();
        });

        it('Shuld expose an existing friend and mask setting after $onInit', function () {
            expect(FriendFormComponentCtrl.friend).toBeDefined();

            FriendFormComponentCtrl.$onInit();

            expect(FriendFormComponentCtrl.friend).toBeDefined();
            expect(FriendFormComponentCtrl.friend.id).toEqual(2);
            expect(FriendFormComponentCtrl.friend.name).toEqual('Arya Stark');
            expect(FriendFormComponentCtrl.friend.getFirstName()).toEqual('Arya');
            expect(FriendFormComponentCtrl.friend.group).toEqual('Club');
        });
    });

    describe('saveFriend', function () {
        var friend, injection, bindings, FriendFormComponentCtrl;

        beforeEach(function () {
            injection = {
                popupService: popupService,
                friendsService: friendsService,
                loadingService: loadingService
            };
            spyOn(loadingService, 'show').and.returnValue($q.resolve());

            spyOn(loadingService, 'hide').and.returnValue($q.resolve());

            spyOn(popupService, 'getPopup').and.returnValue($q.resolve(true));

            friend = angular.copy(friendMockService.friends.data[1]);
            bindings = { groups: groupMockService.groups.data };
            FriendFormComponentCtrl = $componentController('friendForm', injection, bindings);

            spyOn(FriendFormComponentCtrl, '$onInit').and.callFake(function () {
                FriendFormComponentCtrl.friend = friend;
            });
            spyOn(FriendFormComponentCtrl, 'saveFriend').and.callThrough();
            FriendFormComponentCtrl.$onInit();
        });

        it('shuld exist', function () {
            FriendFormComponentCtrl = $componentController('friendForm', null, {});
            expect(FriendFormComponentCtrl.saveFriend).toBeDefined();
        });

        it('saveFriend shuld save a valid Friend', function () {
            spyOn(friendsService, 'save').and.callFake(function (friend) {
                friend.id = 4;

                return $q.resolve(new Friend(friend));
            });
            expect(FriendFormComponentCtrl.saveFriend).not.toHaveBeenCalled();

            FriendFormComponentCtrl.saveFriend();
            $scope.$apply();

            expect(FriendFormComponentCtrl.saveFriend).toHaveBeenCalled();
            expect(loadingService.show).toHaveBeenCalled();
            expect(friendsService.save).toHaveBeenCalledWith(FriendFormComponentCtrl.friend);
            expect(loadingService.hide).toHaveBeenCalled();
            expect(popupService.getPopup)
                .toHaveBeenCalledWith('friends.newFriendSuccessful', null,
                [FriendFormComponentCtrl.friend.name], FriendFormComponentCtrl.friend);
        });

        it('saveFriend shuld save a valid Friend', function () {
            spyOn(friendsService, 'save').and.callFake(function () {
                return $q.reject();
            });
            expect(FriendFormComponentCtrl.saveFriend).not.toHaveBeenCalled();

            FriendFormComponentCtrl.saveFriend();
            $scope.$apply();

            expect(FriendFormComponentCtrl.saveFriend).toHaveBeenCalled();
            expect(loadingService.show).toHaveBeenCalled();
            expect(friendsService.save).toHaveBeenCalledWith(FriendFormComponentCtrl.friend);
            expect(popupService.getPopup).toHaveBeenCalledWith('generalError', undefined);
            expect(loadingService.hide).toHaveBeenCalled();
        });
    });
});
