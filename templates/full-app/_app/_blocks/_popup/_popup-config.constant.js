(function () {
    'use strict';

    var popupConfig = {
        fallbackPopup: {
            namespace: 'core',
            withoutParams: 'generalError',
            withParams: 'generalAPIError'
        },
        // default popup options
        defaultOptions: {
            animation: true,
            backdrop: 'static',
            size: 'sm',
            component: 'popup',
            keyboard: false,
            windowClass: 'popup-modal'
        },
        // These options can be overriden when initiating the popups on each module
        defaultPopupTemplate: {
            type: 'alert', // 'alert' shows only ok button, 'confirm' shows both
            isError: false, // if set to true the ok button will reject the promise too
            title: '',
            body: '',
            cancelButtonText: 'Cancel',
            cancelButtonClass: 'btn-info',
            okButtonText: 'Ok',
            okButtonClass: 'btn-primary'
        }
    };

    angular
        .module('blocks.popup')
        .constant('PopupConfig', popupConfig);
})();
