/* eslint-env node, jasmine */
'use strict';
describe('<%=Name=%> Service', function () {
    var <%=Name=%>, <%=name=%>sService, <%=name=%>MockService, <%=name=%>s;

    // Before each test load our app.<%=module=%> module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('<%=module=%>'));
    beforeEach(angular.mock.module('modelMocks'));

    /** Before each test set our injected <%=name=%>sService factory (_<%=name=%>sService_)
     *  to our local <%=name=%>sService variable
     */
    beforeEach(inject(function (_<%=Name=%>_, _<%=name=%>sService_, _<%=name=%>MockService_) {
        <%=Name=%> = _<%=Name=%>_;
        <%=name=%>sService = _<%=name=%>sService_;
        <%=name=%>MockService = _<%=name=%>MockService_;
        <%=name=%>s = <%=name=%>MockService.<%=name=%>s.data;
    }));

    // A simple test to verify the <%=name=%>sService factory exists
    it('should exist', function () {
        expect(<%=name=%>sService).toBeDefined();
    });

    describe('get', function () {
        // A simple test to verify the method all exists
        it('should exist', function () {
            expect(<%=name=%>sService.get).toBeDefined();
        });

        it('should return a hard-coded <%=name=%> when called with a valid id', function () {
            var id = 2;
            spyOn(<%=Name=%>, 'get').and.callFake(function () {
                return <%=name=%>s[id - 1];
            });
            spyOn(<%=name=%>sService, 'get').and.callThrough();

            var result = <%=name=%>sService.get(id);

            expect(<%=Name=%>.get).toHaveBeenCalledWith({ id: id });
            expect(<%=name=%>sService.get).toHaveBeenCalledWith(id);

            expect(result).toEqual(<%=name=%>s[1]);

            expect(result instanceof <%=Name=%>).toEqual(true);
            expect(result.id).toEqual(2);
            expect(result.name).toEqual('data2');
            expect(result.group).toEqual('group1');
        });
    });

    describe('getAll', function () {
        // A simple test to verify the method all exists
        it('should exist', function () {
            expect(<%=name=%>sService.getAll).toBeDefined();
        });

        it('should return a hard-coded list of <%=name=%>s', function () {
            spyOn(<%=Name=%>, 'query').and.callFake(function () {
                return <%=name=%>s;
            });
            spyOn(<%=name=%>sService, 'getAll').and.callThrough();

            var result = <%=name=%>sService.getAll();

            expect(<%=Name=%>.query).toHaveBeenCalled();
            expect(<%=name=%>sService.getAll).toHaveBeenCalled();

            expect(result).toEqual(<%=name=%>s);
            expect(result instanceof Array).toEqual(true);

            var <%=name=%> = result[0];
            expect(<%=name=%> instanceof <%=Name=%>).toEqual(true);
            expect(<%=name=%>.id).toEqual(1);
            expect(<%=name=%>.name).toEqual('data1');
            expect(<%=name=%>.group).toEqual('group2');
        });
    });

    describe('new<%=Name=%>', function () {
        it('should exist', function () {
            expect(<%=name=%>sService.new<%=Name=%>).toBeDefined();
        });

        it('should return a new <%=name=%> with empty number', function () {

            spyOn(<%=name=%>sService, 'new<%=Name=%>').and.callThrough();

            var result = <%=name=%>sService.new<%=Name=%>();

            expect(<%=name=%>sService.new<%=Name=%>).toHaveBeenCalled();

            expect(result).toEqual(new <%=Name=%>({ name: '', group: 'group1' }));
            expect(result instanceof <%=Name=%>).toEqual(true);
            expect(result.id).not.toBeDefined();
            expect(result.name).toEqual('');
            expect(result.group).toEqual('group1');
        });
    });

    describe('remove', function () {
        it('should exist', function () {
            expect(<%=name=%>sService.remove).toBeDefined();
        });

        it('should remove a <%=name=%> when called with a valid <%=name=%>', function () {
            var <%=name=%> = <%=name=%>s[1];
            spyOn(<%=Name=%>, 'delete').and.callFake(function () {
                <%=name=%>s.splice(<%=name=%>s.indexOf(<%=name=%>), 1);

                return <%=name=%>;
            });
            spyOn(<%=name=%>sService, 'remove').and.callThrough();

            var result = <%=name=%>sService.remove(<%=name=%>);

            expect(<%=Name=%>.delete).toHaveBeenCalled();
            expect(<%=name=%>sService.remove).toHaveBeenCalledWith(<%=name=%>);

            expect(result).toEqual(<%=name=%>);
            expect(result instanceof <%=Name=%>).toEqual(true);
            expect(result.id).toEqual(2);
            expect(result.name).toEqual('data2');
            expect(result.group).toEqual('group1');
            expect(<%=name=%>s.length).toEqual(2);
        });
    });

    describe('save', function () {
        // A simple test to verify the method all exists
        it('should exist', function () {
            expect(<%=name=%>sService.save).toBeDefined();
        });

        beforeEach(function () {
            spyOn(<%=name=%>sService, 'save').and.callThrough();
        });

        it('should add a <%=name=%> when called with a valid <%=Name=%>', function () {
            var <%=name=%> = new <%=Name=%>({ name: 'data4', group: 'group2' });
            spyOn(<%=Name=%>, 'save').and.callFake(function () {
                <%=name=%>.id = 4;
                <%=name=%>s.push(<%=name=%>);

                return <%=name=%>;
            });

            expect(<%=name=%>.id).not.toBeDefined();

            var result = <%=name=%>sService.save(<%=name=%>);

            expect(<%=Name=%>.save).toHaveBeenCalled();
            expect(<%=name=%>sService.save).toHaveBeenCalledWith(<%=name=%>);

            expect(result).toEqual(<%=name=%>s[3]);

            expect(result instanceof <%=Name=%>).toEqual(true);
            expect(result.id).toEqual(4);
            expect(result.name).toEqual('data4');
            expect(result.group).toEqual('group2');
            expect(<%=name=%>s.length).toEqual(4);
        });

        it('should update a <%=name=%> when called with a valid existing <%=Name=%>', function () {
            var index = 2;
            var <%=name=%> = <%=name=%>s[index];
            <%=name=%>.name = 'data3';
            <%=name=%>.group = 'New';
            spyOn(<%=Name=%>, 'update').and.callFake(function () {
                <%=name=%>s[index].name = <%=name=%>.name;
                <%=name=%>s[index].group = <%=name=%>.group;

                return <%=name=%>s[index];
            });
            expect(<%=name=%>.id).toEqual(3);

            var result = <%=name=%>sService.save(<%=name=%>);

            expect(<%=Name=%>.update).toHaveBeenCalled();
            expect(<%=name=%>sService.save).toHaveBeenCalledWith(<%=name=%>);

            expect(result).toEqual(<%=name=%>s[index]);

            expect(result instanceof <%=Name=%>).toEqual(true);
            expect(result.id).toEqual(3);
            expect(result.name).toEqual('data3');
            expect(result.group).toEqual('New');
            expect(<%=name=%>s.length).toEqual(3);
        });
    });
});
