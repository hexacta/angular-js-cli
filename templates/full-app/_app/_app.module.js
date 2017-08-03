(function () {
    'use strict';

    angular.module('app', [
        'app.core',
        'app.layout',
        /* replace:session */
        'app.session',
        /* endreplace:session */
        /* replace:friends */
        'app.friends',
        /* endreplace:friends */
        'app.widgets'
    ]);
})();
