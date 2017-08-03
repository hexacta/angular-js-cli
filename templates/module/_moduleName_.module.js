(function () {
    'use strict';

    angular
        .module('<%=module=%>', [
            'blocks.popup',
            'ngMessages',
            'common'
        ]);

    /**
     * Only if necesary create de run block of app.<%=name=%> module below.
     * Avoid using logic inside the run block
     *
     * .run(appRun);
     *
     * appRun.$inject = [];
     *
     * function appRun() {
     *     // TODO implement
     * }
     *
     */
})();
