/*
*   Popup service for Angular-ui-Bootstrap
*   7/29/2016
*
*/
(function () {
    'use strict';
    /* jshint validthis: true */

    angular
        .module('blocks.popup')
        .provider('popupService', popupServiceProvider);

    popupServiceProvider.$inject = ['PopupConfig'];

    function popupServiceProvider(PopupConfig) {
        var fallbackPopup = PopupConfig.fallbackPopup;
        var popupInstances = [];
        var popups = {
            default: {
                'unknownPopup': {
                    title: 'Popup Not Found',
                    body: 'No popup matches the namespace.popupName.'
                }
            }
        };

        this.addPopups = addPopups;

        function addPopups(newPopups, namespace) {
            if (!popups.hasOwnProperty(namespace)) {
                popups[namespace] = {};
            }
            for (var key in newPopups) {
                if (newPopups.hasOwnProperty(key)) {
                    popups[namespace][key] = newPopups[key];
                }
            }
        }

        this.$get = PopupService;

        PopupService.$inject = ['$rootScope', '$q', '$uibModal', 'PopupConfig'];

        function PopupService($rootScope, $q, $uibModal, PopupConfig) {

            var service = {
                closeAllPopups: closeAll,
                getPopup: getPopup,
                getPopupWith: getPopupWith
            };

            return service;

            function closeAll() {
                for (var i = 0; i < popupInstances.length; i++) {
                    var popupInstance = popupInstances.pop();
                    popupInstance.dismiss('cancel');
                }
                $q.resolve();
            }

            function getPopup(fullName, popupScope, params) {
                var namespace = fullName.split('.')[0];
                var name = fullName.split('.')[1];
                var isError = false;

                if (!popups.hasOwnProperty(namespace) || !popups[namespace].hasOwnProperty(name)) {
                    isError = true;
                    namespace = fallbackPopup.namespace;
                    name = params ? fallbackPopup.withParams : fallbackPopup.withoutParams;
                }
                var message = popups[namespace][name];
                if (params && params.length) {
                    message = setPopupWithParameters(message, params);
                }
                message.isError = isError;

                return getPopupWith(message, popupScope);
            }

            function getPopupWith(data, popupScope) {
                var popupData = angular.copy(PopupConfig.defaultOptions);
                popupData.scope = popupScope || $rootScope;
                popupData.resolve = { popup: overrideOptions.bind(null, data) };

                var popupInstance = $uibModal.open(popupData);
                popupInstances.push(popupInstance);

                return popupInstance.result;
            }

            function overrideOptions(data) {
                // Override default options
                var popupTemplate = angular.copy(PopupConfig.defaultPopupTemplate);
                angular.forEach(Object.keys(popupTemplate), function (key) {
                    if (popupTemplate.hasOwnProperty(key) && data.hasOwnProperty(key)) {
                        popupTemplate[key] = data[key];
                    }
                });

                return popupTemplate;
            }

            function setPopupWithParameters(popup, params) {
                var data = angular.copy(popup);

                for (var i = 0; i < params.length; i++) {
                    if (data.hasOwnProperty('title')) {
                        data.title = data.title.replace('?' + (i + 1), params[i]);
                    }
                    if (data.hasOwnProperty('body')) {
                        data.body = data.body.replace('?' + (i + 1), params[i]);
                    }
                    if (data.hasOwnProperty('okButtonText')) {
                        data.okButtonText = data.okButtonText.replace('?' + (i + 1), params[i]);
                    }
                    if (data.hasOwnProperty('cancelButtonText')) {
                        data.cancelButtonText = data.cancelButtonText.replace('?' + (i + 1), params[i]);
                    }
                }

                return data;
            }
        }
    }
})();
