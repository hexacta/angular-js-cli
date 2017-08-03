(function () {
    'use strict';

    var sessionConfig = {        
        /* replace:friends:state */
        loginState: 'app.friends',
        /* endreplace:friends:state */
        popupTimeout: 15000,
        storageName: 'userData',
        timeBeforeExpiring: 30000
    };

    angular
        .module('app.session')
        .constant('SessionConfig', sessionConfig);
})();
