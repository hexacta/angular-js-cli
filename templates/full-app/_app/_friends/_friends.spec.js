/* eslint-env node, jasmine */
'use strict';
describe('Friends Module configuratoin and startup', function () {
    var $scope, $state, $q, friends, friendsService, groups, groupsService;

    // Before each test load our api.friends module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('app.friends'));
    beforeEach(angular.mock.module('modelMocks'));

    // Before each test set our injected groupsService factory (_groupsService_)
    // to our local groupsService variable
    beforeEach(inject(function (_$rootScope_, _$state_, _$q_, _friendsService_,
        _friendMockService_, _groupsService_, _groupMockService_) {
        $state = _$state_;
        $q = _$q_;
        $scope = _$rootScope_.$new();
        friendsService = _friendsService_;
        groupsService = _groupsService_;
        friends = _friendMockService_.friends.data;
        groups = _groupMockService_.groups.data;
    }));

    describe('Friends Module routing', function () {
        describe('fetchFriends', function () {

            it('should be resolved', function () {
                spyOn(friendsService, 'getAll').and.returnValue($q.resolve(friends));

                $state.go('app.friends');
                $scope.$apply();

                expect(friendsService.getAll).toHaveBeenCalled();
            });
        });

        describe('fetchGroups', function () {

            it('should be resolved', function () {
                spyOn(groupsService, 'getAll').and.returnValue($q.resolve(groups));

                $state.go('app.friend-form');
                $scope.$apply();

                expect(groupsService.getAll).toHaveBeenCalled();
            });
        });
    });
});
