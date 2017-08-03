/*
*   LoadingScreen service for Angular-ui-Bootstrap
*   7/29/2016
*
*/
(function () {
    'use strict';

    angular
        .module('common')
        .factory('loadingService', loadingService);

    loadingService.$inject = ['$rootScope', '$q', '$uibModal'];

    function loadingService($rootScope, $q, $uibModal) {
        var deffered;
        var loadingInstance;
        var scope;

        var loading = '<div class="modal-header"><h3 style="margin:0;">?message?</h3></div>' +
            '<div class="modal-body">' +
            '<div class="progress progress-striped active" style="margin-bottom:0;">' +
            '<div class="progress-bar" style="width: 100%"></div></div>' +
            '</div>';

        var service = {
            show: show,
            hide: hide
        };

        return service;

        // Returns true if okButton was clicked, false if the cancelButton was clicked
        function hide(response) {
            if (loadingInstance) {
                loadingInstance.dismiss('cancel');
                deffered.resolve(response);

                return deffered.promise;
            }

            return $q.resolve(response);

        }

        function show(message, loadingScreenScope) {
            deffered = $q.defer();
            scope = loadingScreenScope || $rootScope;
            var loadingMessage = 'Loading';
            if (message && (typeof message === 'string')) {
                loadingMessage = message;
            }
            var loadingScreenData = {
                size: 'modal-m',
                keyboard: false,
                backdrop: 'static',
                windowClass: 'loading-screen-modal',
                scope: scope,
                template: loading.replace('?message?', loadingMessage)
            };

            loadingInstance = $uibModal.open(loadingScreenData);
            loadingInstance.opened.then(deffered.resolve);

            return deffered.promise;
        }
    }
})();
