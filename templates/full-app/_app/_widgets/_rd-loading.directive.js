(function () {
    'use strict';

    angular
        .module('app.widgets')
        .component('rdLoading', {
            template: '<div class="loading">' +
            '<div class="double-bounce1"></div><div class="double-bounce2"></div>' +
            '</div>'
        });
})();
