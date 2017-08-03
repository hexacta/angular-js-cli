(function () {
    'use strict';

    var coreConfig = {
        API: {
            relative: false,
            protocol: 'http',
            host: 'localhost',
            port: '4000',
            path: 'api'
        },
        appTitle: '<%=title=%>',
        /* replace:session:route */
        defaultState: '/login',
        /* endreplace:session:route */
        date: {
            format: 'MM/dd/yy',
            altFormat: ['MMddyy', 'MM-dd-yy']
        }
    };

    angular
        .module('app.core')
        .constant('CoreConfig', coreConfig);
})();
