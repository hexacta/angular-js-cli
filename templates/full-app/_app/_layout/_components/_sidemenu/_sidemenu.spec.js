/* eslint-env node, jasmine */
'use strict';
describe('Sidemenu Component', function () {
    var $componentController, $state, SidemenuComponentCtrl,
        routerHelper;

    var states = [
        {
            url: '/state-one',
            component: 'stateOne',
            resolve: {},
            title: 'State One',
            internalName: 'StateOne',
            settings: {
                nav: 2,
                icon: 'fa-users'
            },
            name: 'app.state-one'
        }, {
            url: '/state-two',
            component: 'stateTwo',
            resolve: {},
            title: 'State Two',
            internalName: 'StateTwo',
            settings: {
                nav: 1,
                icon: 'fa-plus'
            },
            name: 'app.state-two'
        }
    ];

    // Before each test load our api.layout module
    beforeEach(angular.mock.module('app.core'));
    beforeEach(angular.mock.module('blocks.router'));
    beforeEach(angular.mock.module('app.layout'));

    beforeEach(inject(function (_$componentController_, _$state_, _routerHelper_) {
        $componentController = _$componentController_;
        $state = _$state_;
        routerHelper = _routerHelper_;
    }));

    beforeEach(function () {
        var bindings = {
            logout: angular.noop,
            restrictedScreens: [],
            toggleSidebar: angular.noop
        };
        var injection = {
            $state: $state,
            routerHelper: routerHelper
        };
        SidemenuComponentCtrl = $componentController('sidemenu', injection,
            bindings);
    });

    describe('Sidemenu Ctrl', function () {

        it('should exist', function () {
            expect(SidemenuComponentCtrl).toBeDefined();
        });

        it('Shuld have imports and intial exports defined before $onInit', function () {
            spyOn(routerHelper, 'getStates').and.returnValue();

            expect(SidemenuComponentCtrl.logout).toBeDefined();
            expect(SidemenuComponentCtrl.restrictedScreens).toBeDefined();
            expect(SidemenuComponentCtrl.toggleSidebar).toBeDefined();

            expect(SidemenuComponentCtrl.hasRestrictedAccess).toBeDefined();
            expect(SidemenuComponentCtrl.isCurrent).toBeDefined();

            expect(SidemenuComponentCtrl.appTitle).not.toBeDefined();
        });
    });

    describe('$onInit', function () {

        beforeEach(function () {

            spyOn(routerHelper, 'getStates').and.returnValue(states);

            spyOn(SidemenuComponentCtrl, '$onInit').and.callThrough();
        });

        it('shuld exist', function () {
            expect(SidemenuComponentCtrl.$onInit).toBeDefined();
        });

        it('shuld init the menu with the states\' info and sort it by nav', function () {

            SidemenuComponentCtrl.$onInit();

            expect(SidemenuComponentCtrl.$onInit).toHaveBeenCalled();
            expect(routerHelper.getStates).toHaveBeenCalled();
            expect(SidemenuComponentCtrl.navRoutes[0]).toEqual(states[1]);
            expect(SidemenuComponentCtrl.navRoutes[1]).toEqual(states[0]);
        });
    });

    describe('hasRestrictedAccess', function () {
        var result, state;

        beforeEach(function () {
            state = states[0];

            spyOn(SidemenuComponentCtrl, 'hasRestrictedAccess').and.callThrough();

            SidemenuComponentCtrl.$onInit();
        });

        it('shuld exist', function () {
            expect(SidemenuComponentCtrl.hasRestrictedAccess).toBeDefined();
        });

        it('shuld return false if there are no restricted screens', function () {
            SidemenuComponentCtrl.restrictedScreens = null;

            result = SidemenuComponentCtrl.hasRestrictedAccess(state);

            expect(SidemenuComponentCtrl.hasRestrictedAccess).toHaveBeenCalledWith(state);
            expect(result).toEqual(null);
        });

        it('shuld return true if route is inside the restricted screens', function () {
            SidemenuComponentCtrl.restrictedScreens = ['StateOne'];

            result = SidemenuComponentCtrl.hasRestrictedAccess(state);

            expect(SidemenuComponentCtrl.hasRestrictedAccess).toHaveBeenCalledWith(state);
            expect(result).toEqual(true);
        });

        it('shuld return false if route is not inside the restricted screens', function () {
            SidemenuComponentCtrl.restrictedScreens = ['StateTwo'];

            result = SidemenuComponentCtrl.hasRestrictedAccess(state);

            expect(SidemenuComponentCtrl.hasRestrictedAccess).toHaveBeenCalledWith(state);
            expect(result).toEqual(false);
        });
    });

    describe('isCurrent', function () {
        var result, state;

        beforeEach(function () {
            state = states[0];

            spyOn(SidemenuComponentCtrl, 'isCurrent').and.callThrough();

            SidemenuComponentCtrl.$onInit();
        });

        it('shuld exist', function () {
            expect(SidemenuComponentCtrl.isCurrent).toBeDefined();
        });

        it('shuld return false if no current state active', function () {
            result = SidemenuComponentCtrl.isCurrent(state);

            expect(SidemenuComponentCtrl.isCurrent).toHaveBeenCalledWith(state);
            expect(result).toEqual('');
        });

        it('shuld return false if current state is not the recieved one', function () {
            $state.current.title = 'State Two';
            $state.current.internalName = 'StateTwo';

            result = SidemenuComponentCtrl.isCurrent(state);

            expect(SidemenuComponentCtrl.isCurrent).toHaveBeenCalledWith(state);
            expect(result).toEqual(false);
        });

        it('shuld return true if current state is the recieved one', function () {
            $state.current.title = 'State One';
            $state.current.internalName = 'StateOne';

            result = SidemenuComponentCtrl.isCurrent(state);

            expect(SidemenuComponentCtrl.isCurrent).toHaveBeenCalledWith(state);
            expect(result).toEqual(true);
        });
    });
});
