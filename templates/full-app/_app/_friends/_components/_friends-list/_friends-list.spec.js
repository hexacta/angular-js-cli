/* eslint-env node, jasmine */
'use strict';
describe('FriendsList Component', function () {
    var $scope, $componentController, $q, $uibModal, Friend,
        popupService, friendsService, loadingService, groupMockService, friendMockService, groupsService;

    // Before each test load our api.friends module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('app.friends'));
    beforeEach(angular.mock.module('modelMocks'));

    // eslint-disable-next-line max-params
    beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _$uibModal_,
        _groupMockService_, _groupsService_, _friendMockService_, _friendsService_, _Friend_,
        _loadingService_, _popupService_) {
        Friend = _Friend_;
        $componentController = _$componentController_;
        popupService = _popupService_;
        friendsService = _friendsService_;
        loadingService = _loadingService_;
        groupMockService = _groupMockService_;
        friendMockService = _friendMockService_;
        groupsService = _groupsService_;
        $uibModal = _$uibModal_;
        $q = _$q_;
        $scope = _$rootScope_.$new();
    }));

    var friend, FriendsListComponentCtrl, injection, bindings, allFriends;
    beforeEach(function () {
        injection = {
            popupService: popupService,
            friendsService: friendsService,
            loadingService: loadingService
        };

        friend = angular.copy(friendMockService.friends.data[2]);
        allFriends = angular.copy(friendMockService.friends);
        bindings = { groups: groupMockService.groups.data };
        FriendsListComponentCtrl = $componentController('friendsList', injection, bindings);

        spyOn(loadingService, 'show').and.returnValue($q.resolve());
        spyOn(loadingService, 'hide').and.returnValue($q.resolve());
        spyOn(friendsService, 'getAll').and.returnValue($q.resolve(allFriends));
    });

    describe('FriendsList Ctrl', function () {
        var bindings, FriendsListComponentCtrl;

        beforeEach(function () {
            bindings = {};
            FriendsListComponentCtrl = $componentController('friendsList',
                null, bindings);
        });

        it('should exist', function () {
            expect(FriendsListComponentCtrl).toBeDefined();
        });
    });

    describe('FriendsList with valid friends', function () {
        var bindings, FriendsListComponentCtrl;

        beforeEach(function () {
            bindings = { friends: friendMockService.friends.data };

            FriendsListComponentCtrl = $componentController('friendsList',
                {
                    popupService: popupService,
                    groupsService: groupsService,
                    friendsService: friendsService,
                    loadingService: loadingService
                }, bindings);
        });

        it('Should have friends binded', function () {
            expect(FriendsListComponentCtrl.friends).toBeDefined();
            expect(FriendsListComponentCtrl.friends[0].group).toEqual('Family');
            expect(FriendsListComponentCtrl.friends[0].name).toEqual('Jon Snow');
        });

        it('Should have functions defined', function () {
            expect(FriendsListComponentCtrl.openModal).toBeDefined();
            expect(FriendsListComponentCtrl.removeFriend).toBeDefined();
        });
    });

    describe('OpenModal method', function () {

        it('should exist', function () {
            expect(FriendsListComponentCtrl, 'openModal').toBeDefined();
        });

        it('should save friend and reload all when called with a friend', function () {

            var result = { result: $q.resolve(friend) };
            var spyOpenModal = spyOn(FriendsListComponentCtrl, 'openModal').and.callThrough();
            spyOn($uibModal, 'open').and.returnValue(result);
            spyOn(friendsService, 'save').and.returnValue($q.resolve(new Friend(friend)));

            FriendsListComponentCtrl.openModal(friend);
            $scope.$apply();

            expect(spyOpenModal).toHaveBeenCalledWith(friend);
            expect($uibModal.open).toHaveBeenCalled();
            expect(loadingService.show).toHaveBeenCalled();
            expect(friendsService.save).toHaveBeenCalledWith(friend);
            expect(loadingService.hide).toHaveBeenCalled();
            expect(friendsService.getAll).toHaveBeenCalled();
        });

        it('should save friend and reload all when called without a friend', function () {

            var result = { result: $q.resolve(friend) };
            var spyOpenModal = spyOn(FriendsListComponentCtrl, 'openModal').and.callThrough();
            spyOn($uibModal, 'open').and.returnValue(result);
            spyOn(friendsService, 'save').and.returnValue($q.resolve(new Friend(friend)));

            FriendsListComponentCtrl.openModal();
            $scope.$apply();

            expect(spyOpenModal).toHaveBeenCalledWith();
            expect($uibModal.open).toHaveBeenCalled();
            expect(loadingService.show).toHaveBeenCalled();
            expect(friendsService.save).toHaveBeenCalledWith(friend);
            expect(loadingService.hide).toHaveBeenCalled();
            expect(friendsService.getAll).toHaveBeenCalled();
        });

    });

    describe('removeFriend', function () {

        it('should exist', function () {
            expect(FriendsListComponentCtrl, 'removeFriend').toBeDefined();
        });

        it('should remove friend and reload all', function () {
            spyOn(FriendsListComponentCtrl, 'removeFriend').and.callThrough();
            spyOn(popupService, 'getPopup').and.returnValue($q.resolve(true));
            spyOn(friendsService, 'remove').and.returnValue($q.resolve(friend));

            FriendsListComponentCtrl.removeFriend(friend);
            $scope.$apply();

            expect(FriendsListComponentCtrl.removeFriend).toHaveBeenCalledWith(friend);
            expect(popupService.getPopup).toHaveBeenCalled();
            expect(loadingService.show).toHaveBeenCalled();
            expect(friendsService.remove).toHaveBeenCalled();
            expect(loadingService.hide).toHaveBeenCalled();
            expect(friendsService.getAll).toHaveBeenCalled();
        });
    });
});
