(function () {
    'use strict';

    angular
        .module('app.core', [
            /* replace:session:remove */
            'common',
            /* endreplace:session:remove */
            'ngResource',
            'ui.bootstrap',
            'ui.router',
            'blocks.popup',
            'blocks.exception',
            'blocks.logger',
            'blocks.router'
        ]);
})();
