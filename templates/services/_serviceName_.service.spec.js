/* eslint-env node, jasmine */
'use strict';
describe('<%=Name=%> Service', function () {
    var <%=name=%>Service;

    // Before each test load our app.<%=module=%> module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('<%=module=%>'));

    /** Before each test set our injected <%=name=%>Service factory (_<%=name=%>Service_)
     *  to our local <%=name=%>Service variable
     */
    beforeEach(inject(function (_<%=name=%>Service_) {
        <%=name=%>Service = _<%=name=%>Service_;
    }));

    // A simple test to verify the <%=name=%>Service factory exists
    it('should exist', function () {
        expect(<%=name=%>Service).toBeDefined();
    });

    describe('log', function () {
        // A simple test to verify the method all exists
        it('should exist', function () {
            expect(<%=name=%>Service.log).toBeDefined();
        });

        it('should return a timestamp with my message', function () {
            var message = 'helo world';
            var date = new Date().toJSON()
                                .slice(0, 10);

            spyOn(<%=name=%>Service, 'log').and.callThrough();

            var result = <%=name=%>Service.log(message);

            expect(<%=name=%>Service.log).toHaveBeenCalledWith(message);

            expect(result).toEqual(date + message);
        });
    });
});
