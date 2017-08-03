(function () {
    'use strict';
    angular.module('app.friends')
        .component('friendFormModal', {
            templateUrl: 'app/friends/components/friend-form/friend-form.template.html',
            controller: FriendFormModalCtrl,
            bindings: {
                close: '&',
                dismiss: '&',
                resolve: '<'
            }
        });

    FriendFormModalCtrl.$inject = [];

    function FriendFormModalCtrl() {
        var ctrl = this;

        ctrl.cancel = cancel;
        ctrl.saveFriend = ok;

        ctrl.$onInit = activate;

        function activate() {
            ctrl.isModal = true;
            ctrl.friend = ctrl.resolve.friend;
            ctrl.groups = ctrl.resolve.groups;
        }

        function ok() {
            ctrl.close({ $value: ctrl.friend });
        }

        function cancel() {
            ctrl.dismiss({ $value: 'cancel' });
        }
    }
})();

