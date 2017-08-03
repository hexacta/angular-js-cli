/* eslint-env node, jasmine */
'use strict';
describe('Friend', function () {
    var $httpBackend, Friend, friendMockService, mocksHelper;

    // Before each test load our app.friends module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('app.friends'));
    beforeEach(angular.mock.module('modelMocks'));

    beforeEach(inject(function (_$httpBackend_, _friendMockService_, _Friend_, _mocksHelper_) {
        $httpBackend = _$httpBackend_;
        Friend = _Friend_;
        friendMockService = _friendMockService_;
        mocksHelper = _mocksHelper_;
    }));

    beforeEach(function () {
        mocksHelper.addMocks(friendMockService.APIMethods);
    });

    // A simple test to verify the friendsService factory exists
    it('should exist', function () {
        expect(Friend).toBeDefined();
    });
    describe('get', function () {
        it('should exist', function () {
            expect(Friend.get).toBeDefined();
        });
        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Friend, 'get').and.callThrough();
        });

        afterEach(function () {
            expect(friendMockService.friends.data.length).toEqual(3);
        });

        it('should return a Friend when called with a valid id', function () {
            var id = 3;

            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            expect(Friend.get).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = Friend.get({ id: id });

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(Friend.get).toHaveBeenCalledWith({ id: id });
            expect(result instanceof Friend).toEqual(true);
            expect(result.id).toEqual(3);
            expect(result.name).toEqual('Cersei Lannister');
            expect(result.group).toEqual('Club');
        });

        it('should return a 404 when called with an invalid id', function () {
            var id = 12;

            expect(Friend.get).not.toHaveBeenCalled();
            expect(result).toEqual({});

            Friend.get({ id: id }).$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(Friend.get).toHaveBeenCalledWith({ id: id });
            expect(result.error).toEqual('Not found');
        });
    });

    describe('save', function () {
        it('should exist', function () {
            expect(Friend.save).toBeDefined();
        });

        var result;
        var friend;

        beforeEach(function () {
            friend = new Friend({ name: 'Tyrion Lannister', group: 'Club' });

            result = {};

            spyOn(Friend, 'save').and.callThrough();
        });

        it('should save a Friend when called with a valid Friend object', function () {

            expect(Friend.save).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = Friend.save(friend);

            $httpBackend.flush();

            expect(Friend.save).toHaveBeenCalledWith(friend);
            expect(result instanceof Friend).toEqual(true);
            expect(result.id).toEqual(4);
            expect(result.name).toEqual('Tyrion Lannister');
            expect(result.group).toEqual('Club');
            expect(friendMockService.friends.data.length).toEqual(4);
        });
    });

    describe('query', function () {
        it('should exist', function () {
            expect(Friend.query).toBeDefined();
        });

        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Friend, 'query').and.callThrough();
        });

        it('should return a Friend when called with a valid name', function () {
            var name = 'Cersei Lannister';

            expect(Friend.query).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = Friend.query({ name: name });

            $httpBackend.flush();

            expect(Friend.query).toHaveBeenCalledWith({ name: name });
            expect(friendMockService.friends.data.length).toEqual(3);
            expect(result instanceof Array).toEqual(true);
            expect(result.length).toEqual(1);

            var friend = result[0];
            expect(friend instanceof Friend).toEqual(true);
            expect(friend.id).toEqual(3);
            expect(friend.name).toEqual('Cersei Lannister');
            expect(friend.group).toEqual('Club');
        });

        it('should return a Friend when called with a valid group', function () {
            var filter = { group: 'Club' };

            expect(Friend.query).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = Friend.query(filter);

            $httpBackend.flush();
            expect(Friend.query).toHaveBeenCalledWith(filter);
            expect(friendMockService.friends.data.length).toEqual(3);
            expect(result instanceof Array).toEqual(true);

            expect(result.length).toEqual(2);

            var friend = result[0];
            expect(friend instanceof Friend).toEqual(true);
            expect(friend.id).toEqual(2);
            expect(friend.name).toEqual('Arya Stark');
            expect(friend.group).toEqual('Club');
        });

        it('should return a Friend when called with a valid name and group', function () {
            var filter = { name: 'Arya Stark', group: 'Club' };

            expect(Friend.query).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = Friend.query(filter);

            $httpBackend.flush();

            expect(Friend.query).toHaveBeenCalledWith(filter);
            expect(friendMockService.friends.data.length).toEqual(3);
            expect(result instanceof Array).toEqual(true);
            expect(result.length).toEqual(1);

            var friend = result[0];
            expect(friend instanceof Friend).toEqual(true);
            expect(friend.id).toEqual(2);
            expect(friend.name).toEqual('Arya Stark');
            expect(friend.group).toEqual('Club');
        });

        it('should return a 404 when no results found', function () {
            var filter = { name: 'Arya Stark', group: 'Family' };

            expect(Friend.query).not.toHaveBeenCalled();
            expect(result).toEqual({});

            Friend.query(filter).$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(Friend.query).toHaveBeenCalledWith(filter);
            expect(result.error).toEqual('None found');
        });
    });

    describe('delete', function () {
        it('should exist', function () {
            expect(Friend.delete).toBeDefined();
        });

        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(Friend, 'delete').and.callThrough();
        });

        it('should delete and return a Friend when called with a valid id', function () {
            var id = 2;

            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            expect(Friend.delete).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = Friend.delete({ id: id });

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(friendMockService.friends.data.length).toEqual(2);
            expect(Friend.delete).toHaveBeenCalledWith({ id: id });

            expect(result instanceof Friend).toEqual(true);
            expect(result.id).toEqual(2);
            expect(result.name).toEqual('Arya Stark');
            expect(result.group).toEqual('Club');
        });

        it('should return a 404 when called with an invalid id', function () {
            var id = 12;

            expect(Friend.delete).not.toHaveBeenCalled();
            expect(result).toEqual({});

            Friend.delete({ id: id }).$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(Friend.delete).toHaveBeenCalledWith({ id: id });
            expect(result.error).toEqual('Not found');
        });
    });

    describe('update', function () {
        it('should exist', function () {
            expect(Friend.update).toBeDefined();
        });

        var result;
        var friend;

        beforeEach(function () {
            friend = new Friend({ id: 1, name: 'Tyrion Lannister', group: 'Club' });

            result = {};

            spyOn(Friend, 'update').and.callThrough();
        });

        afterEach(function () {
            expect(friendMockService.friends.data.length).toEqual(3);
        });

        it('should update a Friend when called with a valid Friend object', function () {

            expect(Friend.update).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = Friend.update(friend);

            $httpBackend.flush();

            expect(Friend.update).toHaveBeenCalledWith(friend);
            expect(result instanceof Friend).toEqual(true);
            expect(result.id).toEqual(1);
            expect(result.name).toEqual('Tyrion Lannister');
            expect(result.group).toEqual('Club');
        });

        it('should return a 404 when called with an invalid id', function () {
            var id = 12;

            expect(Friend.update).not.toHaveBeenCalled();
            expect(result).toEqual({});

            Friend.update({ id: id }).$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(Friend.update).toHaveBeenCalledWith({ id: id });
            expect(result.error).toEqual('Not found');
        });
    });

    describe('getFirstName', function () {
        var friend;

        beforeEach(function () {
            friend = new Friend({ id: 1, name: 'Tyrion Lannister', group: 'Club' });
            spyOn(friend, 'getFirstName').and.callThrough();
        });

        it('should exist', function () {
            expect(friend.getFirstName).toBeDefined();
        });

        it('should return the friend\'s name', function () {
            expect(friend.getFirstName).not.toHaveBeenCalled();

            var result = friend.getFirstName();

            expect(friend.getFirstName).toHaveBeenCalled();
            expect(result).toEqual('Tyrion');
        });
    });
});
