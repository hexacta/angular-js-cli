(function () {
    'use strict';
    angular.module('blocks.popup')
        .component('popup', {
            templateUrl: 'app/blocks/popup/popup.template.html',
            controller: PopupComponentCtrl,
            bindings: {
                close: '&',
                dismiss: '&',
                resolve: '<'
            }
        });

    PopupComponentCtrl.$inject = [];

    function PopupComponentCtrl() {
        var ctrl = this;

        ctrl.cancel = cancel;
        ctrl.ok = ok;

        ctrl.$onInit = activate;

        function activate() {
            ctrl.popup = ctrl.resolve.popup;
        }

        function ok() {
            if (ctrl.popup.isError) {
                cancel();
            } else {
                ctrl.close({ $value: true });
            }
        }

        function cancel() {
            ctrl.dismiss({ $value: 'cancel' });
        }
    }
})();

