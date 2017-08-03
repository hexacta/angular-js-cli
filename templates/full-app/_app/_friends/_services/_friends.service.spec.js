/* eslint-env node, jasmine */
'use strict';
describe('Friend Service', function () {
    var Friend, friendsService, friendMockService, friends;

    // Before each test load our api.friends module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('app.friends'));
    beforeEach(angular.mock.module('modelMocks'));

    // Before each test set our injected friendsService factory (_friendsService_) to our local friendsService variable
    beforeEach(inject(function (_Friend_, _friendsService_, _friendMockService_) {
        Friend = _Friend_;
        friendsService = _friendsService_;
        friendMockService = _friendMockService_;
        friends = friendMockService.friends.data;
    }));

    // A simple test to verify the friendsService factory exists
    it('should exist', function () {
        expect(friendsService).toBeDefined();
    });

    describe('get', function () {
        // A simple test to verify the method all exists
        it('should exist', function () {
            expect(friendsService.get).toBeDefined();
        });

        it('should return a hard-coded friend when called with a valid id', function () {
            var id = 2;
            spyOn(Friend, 'get').and.callFake(function () {
                return friends[id - 1];
            });
            spyOn(friendsService, 'get').and.callThrough();

            var result = friendsService.get(id);

            expect(Friend.get).toHaveBeenCalledWith({ id: id });
            expect(friendsService.get).toHaveBeenCalledWith(id);

            expect(result).toEqual(friends[1]);

            expect(result instanceof Friend).toEqual(true);
            expect(result.id).toEqual(2);
            expect(result.name).toEqual('Arya Stark');
            expect(result.group).toEqual('Club');
        });
    });

    describe('getAll', function () {
        // A simple test to verify the method all exists
        it('should exist', function () {
            expect(friendsService.getAll).toBeDefined();
        });

        it('should return a hard-coded list of friends', function () {
            spyOn(Friend, 'query').and.callFake(function () {
                return friends;
            });
            spyOn(friendsService, 'getAll').and.callThrough();

            var result = friendsService.getAll();

            expect(Friend.query).toHaveBeenCalled();
            expect(friendsService.getAll).toHaveBeenCalled();

            expect(result).toEqual(friends);
            expect(result instanceof Array).toEqual(true);

            var friend = result[0];
            expect(friend instanceof Friend).toEqual(true);
            expect(friend.id).toEqual(1);
            expect(friend.name).toEqual('Jon Snow');
            expect(friend.group).toEqual('Family');
        });
    });

    describe('newFriend', function () {
        it('should exist', function () {
            expect(friendsService.newFriend).toBeDefined();
        });

        it('should return a new friend with empty name', function () {

            spyOn(friendsService, 'newFriend').and.callThrough();

            var result = friendsService.newFriend();

            expect(friendsService.newFriend).toHaveBeenCalled();

            expect(result).toEqual(new Friend({ name: '', group: 'Club' }));
            expect(result instanceof Friend).toEqual(true);
            expect(result.id).not.toBeDefined();
            expect(result.name).toEqual('');
            expect(result.group).toEqual('Club');
        });
    });

    describe('remove', function () {
        it('should exist', function () {
            expect(friendsService.remove).toBeDefined();
        });

        it('should remove a friend when called with a valid friend', function () {
            var friend = friends[1];
            spyOn(Friend, 'delete').and.callFake(function () {
                friends.splice(friends.indexOf(friend), 1);

                return friend;
            });
            spyOn(friendsService, 'remove').and.callThrough();

            var result = friendsService.remove(friend);

            expect(Friend.delete).toHaveBeenCalled();
            expect(friendsService.remove).toHaveBeenCalledWith(friend);

            expect(result).toEqual(friend);
            expect(result instanceof Friend).toEqual(true);
            expect(result.id).toEqual(2);
            expect(result.name).toEqual('Arya Stark');
            expect(result.group).toEqual('Club');
            expect(friends.length).toEqual(2);
        });
    });

    describe('save', function () {
        // A simple test to verify the method all exists
        it('should exist', function () {
            expect(friendsService.save).toBeDefined();
        });

        beforeEach(function () {
            spyOn(friendsService, 'save').and.callThrough();
        });

        it('should add a friend when called with a valid Friend', function () {
            var friend = new Friend({ name: '44441234123412341234', group: 'Family' });
            spyOn(Friend, 'save').and.callFake(function () {
                friend.id = 4;
                friends.push(friend);

                return friend;
            });

            expect(friend.id).not.toBeDefined();

            var result = friendsService.save(friend);

            expect(Friend.save).toHaveBeenCalled();
            expect(friendsService.save).toHaveBeenCalledWith(friend);

            expect(result).toEqual(friends[3]);

            expect(result instanceof Friend).toEqual(true);
            expect(result.id).toEqual(4);
            expect(result.name).toEqual('44441234123412341234');
            expect(result.group).toEqual('Family');
            expect(friends.length).toEqual(4);
        });

        it('should update a friend when called with a valid existing Friend', function () {
            var index = 2;
            var friend = friends[index];
            friend.name = '45454545454545454545';
            friend.group = 'New';
            spyOn(Friend, 'update').and.callFake(function () {
                friends[index].name = friend.name;
                friends[index].group = friend.group;

                return friends[index];
            });
            expect(friend.id).toEqual(3);

            var result = friendsService.save(friend);

            expect(Friend.update).toHaveBeenCalled();
            expect(friendsService.save).toHaveBeenCalledWith(friend);

            expect(result).toEqual(friends[index]);

            expect(result instanceof Friend).toEqual(true);
            expect(result.id).toEqual(3);
            expect(result.name).toEqual('45454545454545454545');
            expect(result.group).toEqual('New');
            expect(friends.length).toEqual(3);
        });
    });
});
