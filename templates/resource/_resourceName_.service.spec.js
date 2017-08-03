/* eslint-env node, jasmine */
'use strict';
describe('<%=Name=%>', function () {
    var $httpBackend, <%=Name=%>, <%=name=%>MockService, mocksHelper;

    // Before each test load our app.<%=module=%> module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('<%=module=%>'));
    beforeEach(angular.mock.module('modelMocks'));

    beforeEach(inject(function (_$httpBackend_, _<%=name=%>MockService_, _<%=Name=%>_, _mocksHelper_) {
        $httpBackend = _$httpBackend_;
        <%=Name=%> = _<%=Name=%>_;
        <%=name=%>MockService = _<%=name=%>MockService_;
        mocksHelper = _mocksHelper_;
    }));

    beforeEach(function () {
        mocksHelper.addMocks(<%=name=%>MockService.APIMethods);
    });

    // A simple test to verify the <%=name=%>sService factory exists
    it('should exist', function () {
        expect(<%=Name=%>).toBeDefined();
    });

    describe('get', function () {
        it('should exist', function () {
            expect(<%=Name=%>.get).toBeDefined();
        });
        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(<%=Name=%>, 'get').and.callThrough();
        });

        afterEach(function () {
            expect(<%=name=%>MockService.<%=name=%>s.data.length).toEqual(3);
        });

        it('should return a <%=Name=%> when called with a valid id', function () {
            var id = 3;

            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            expect(<%=Name=%>.get).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = <%=Name=%>.get({ id: id });

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(<%=Name=%>.get).toHaveBeenCalledWith({ id: id });
            expect(result instanceof <%=Name=%>).toEqual(true);
            expect(result.id).toEqual(3);
            expect(result.name).toEqual('data3');
            expect(result.group).toEqual('group1');
        });

        it('should return a 404 when called with an invalid id', function () {
            var id = 12;

            expect(<%=Name=%>.get).not.toHaveBeenCalled();
            expect(result).toEqual({});

            <%=Name=%>.get({ id: id }).$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(<%=Name=%>.get).toHaveBeenCalledWith({ id: id });
            expect(result.error).toEqual('Not found');
        });
    });

    describe('save', function () {
        it('should exist', function () {
            expect(<%=Name=%>.save).toBeDefined();
        });

        var result;
        var <%=name=%>;

        beforeEach(function () {
            <%=name=%> = new <%=Name=%>({ name: 'data4', group: 'group1' });

            result = {};

            spyOn(<%=Name=%>, 'save').and.callThrough();
        });

        it('should save a <%=Name=%> when called with a valid <%=Name=%> object', function () {

            expect(<%=Name=%>.save).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = <%=Name=%>.save(<%=name=%>);

            $httpBackend.flush();

            expect(<%=Name=%>.save).toHaveBeenCalledWith(<%=name=%>);
            expect(result instanceof <%=Name=%>).toEqual(true);
            expect(result.id).toEqual(4);
            expect(result.name).toEqual('data4');
            expect(result.group).toEqual('group1');
            expect(<%=name=%>MockService.<%=name=%>s.data.length).toEqual(4);
        });
    });

    describe('query', function () {
        it('should exist', function () {
            expect(<%=Name=%>.query).toBeDefined();
        });

        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(<%=Name=%>, 'query').and.callThrough();
        });

        it('should return a <%=Name=%> when called with a valid name', function () {
            var name = 'data3';

            expect(<%=Name=%>.query).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = <%=Name=%>.query({ name: name });

            $httpBackend.flush();

            expect(<%=Name=%>.query).toHaveBeenCalledWith({ name: name });
            expect(<%=name=%>MockService.<%=name=%>s.data.length).toEqual(3);
            expect(result instanceof Array).toEqual(true);
            expect(result.length).toEqual(1);

            var <%=name=%> = result[0];
            expect(<%=name=%> instanceof <%=Name=%>).toEqual(true);
            expect(<%=name=%>.id).toEqual(3);
            expect(<%=name=%>.name).toEqual('data3');
            expect(<%=name=%>.group).toEqual('group1');
        });

        it('should return a <%=Name=%> when called with a valid group', function () {
            var filter = { group: 'group1' };

            expect(<%=Name=%>.query).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = <%=Name=%>.query(filter);

            $httpBackend.flush();
            expect(<%=Name=%>.query).toHaveBeenCalledWith(filter);
            expect(<%=name=%>MockService.<%=name=%>s.data.length).toEqual(3);
            expect(result instanceof Array).toEqual(true);

            expect(result.length).toEqual(2);

            var <%=name=%> = result[0];
            expect(<%=name=%> instanceof <%=Name=%>).toEqual(true);
            expect(<%=name=%>.id).toEqual(2);
            expect(<%=name=%>.name).toEqual('data2');
            expect(<%=name=%>.group).toEqual('group1');
        });

        it('should return a <%=Name=%> when called with a valid name and group', function () {
            var filter = { name: 'data2', group: 'group1' };

            expect(<%=Name=%>.query).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = <%=Name=%>.query(filter);

            $httpBackend.flush();

            expect(<%=Name=%>.query).toHaveBeenCalledWith(filter);
            expect(<%=name=%>MockService.<%=name=%>s.data.length).toEqual(3);
            expect(result instanceof Array).toEqual(true);
            expect(result.length).toEqual(1);

            var <%=name=%> = result[0];
            expect(<%=name=%> instanceof <%=Name=%>).toEqual(true);
            expect(<%=name=%>.id).toEqual(2);
            expect(<%=name=%>.name).toEqual('data2');
            expect(<%=name=%>.group).toEqual('group1');
        });

        it('should return a 404 when no results found', function () {
            var filter = { name: 'data2', group: 'group2' };

            expect(<%=Name=%>.query).not.toHaveBeenCalled();
            expect(result).toEqual({});

            <%=Name=%>.query(filter).$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(<%=Name=%>.query).toHaveBeenCalledWith(filter);
            expect(result.error).toEqual('None found');
        });
    });

    describe('delete', function () {
        it('should exist', function () {
            expect(<%=Name=%>.delete).toBeDefined();
        });

        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(<%=Name=%>, 'delete').and.callThrough();
        });

        it('should delete and return a <%=Name=%> when called with a valid id', function () {
            var id = 2;

            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            expect(<%=Name=%>.delete).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = <%=Name=%>.delete({ id: id });

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(<%=name=%>MockService.<%=name=%>s.data.length).toEqual(2);
            expect(<%=Name=%>.delete).toHaveBeenCalledWith({ id: id });

            expect(result instanceof <%=Name=%>).toEqual(true);
            expect(result.id).toEqual(2);
            expect(result.name).toEqual('data2');
            expect(result.group).toEqual('group1');
        });

        it('should return a 404 when called with an invalid id', function () {
            var id = 12;

            expect(<%=Name=%>.delete).not.toHaveBeenCalled();
            expect(result).toEqual({});

            <%=Name=%>.delete({ id: id }).$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(<%=Name=%>.delete).toHaveBeenCalledWith({ id: id });
            expect(result.error).toEqual('Not found');
        });
    });

    describe('update', function () {
        it('should exist', function () {
            expect(<%=Name=%>.update).toBeDefined();
        });

        var result;
        var <%=name=%>;

        beforeEach(function () {
            <%=name=%> = new <%=Name=%>({ id: 1, name: 'data4', group: 'group1' });

            result = {};

            spyOn(<%=Name=%>, 'update').and.callThrough();
        });

        afterEach(function () {
            expect(<%=name=%>MockService.<%=name=%>s.data.length).toEqual(3);
        });

        it('should update a <%=Name=%> when called with a valid <%=Name=%> object', function () {

            expect(<%=Name=%>.update).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = <%=Name=%>.update(<%=name=%>);

            $httpBackend.flush();

            expect(<%=Name=%>.update).toHaveBeenCalledWith(<%=name=%>);
            expect(result instanceof <%=Name=%>).toEqual(true);
            expect(result.id).toEqual(1);
            expect(result.name).toEqual('data4');
            expect(result.group).toEqual('group1');
        });

        it('should return a 404 when called with an invalid id', function () {
            var id = 12;

            expect(<%=Name=%>.update).not.toHaveBeenCalled();
            expect(result).toEqual({});

            <%=Name=%>.update({ id: id }).$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(<%=Name=%>.update).toHaveBeenCalledWith({ id: id });
            expect(result.error).toEqual('Not found');
        });
    });

    describe('view', function () {
        it('should exist', function () {
            expect(<%=Name=%>.view).toBeDefined();
        });
        var result;

        beforeEach(function () {
            // Initialize our local result object to an empty object before each test
            result = {};

            // Spy on our service call but allow it to continue to its implementation
            spyOn(<%=Name=%>, 'view').and.callThrough();
        });

        afterEach(function () {
            expect(<%=name=%>MockService.<%=name=%>s.data.length).toEqual(3);
        });

        it('should return a <%=Name=%> when called with a valid id', function () {
            var id = 3;

            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            expect(<%=Name=%>.view).not.toHaveBeenCalled();
            expect(result).toEqual({});

            result = <%=Name=%>.view({ id: id });

            // Flush pending HTTP requests
            $httpBackend.flush();

            expect(<%=Name=%>.view).toHaveBeenCalledWith({ id: id });
            expect(result instanceof <%=Name=%>).toEqual(true);
            expect(result.id).toEqual(3);
            expect(result.name).toEqual('DATA3');
            expect(result.group).toEqual('group1');
        });

        it('should return a 404 when called with an invalid id', function () {
            var id = 12;

            expect(<%=Name=%>.view).not.toHaveBeenCalled();
            expect(result).toEqual({});

            <%=Name=%>.view({ id: id }).$promise
                .catch(function (res) {
                    result = res.data;
                });

            $httpBackend.flush();

            expect(<%=Name=%>.view).toHaveBeenCalledWith({ id: id });
            expect(result.error).toEqual('Not found');
        });
    });

    describe('getSummary', function () {
        var <%=name=%>;

        beforeEach(function () {
            <%=name=%> = new <%=Name=%>({ id: 1, name: 'data4', group: 'group1' });
            spyOn(<%=name=%>, 'getSummary').and.callThrough();
        });

        it('should exist', function () {
            expect(<%=name=%>.getSummary).toBeDefined();
        });

        it('should return the <%=name=%>\'s summary', function () {
            expect(<%=name=%>.getSummary).not.toHaveBeenCalled();

            var result = <%=name=%>.getSummary();

            expect(<%=name=%>.getSummary).toHaveBeenCalled();
            expect(result).toEqual('Summary: data4 - group1');
        });
    });
});
