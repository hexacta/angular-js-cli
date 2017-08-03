(function () {
    'use strict';
    angular.module('app.session')
        .component('changePassword', {
            templateUrl: 'app/session/components/change-password/change-password.template.html',
            controller: ChangePasswordComponentCtrl
        });

    ChangePasswordComponentCtrl.$inject = ['sessionService', 'SessionMessages', 'popupService', 'loadingService'];
    function ChangePasswordComponentCtrl(sessionService, SessionMessages, popupService, loadingService) {
        var ctrl = this;

        ctrl.user = { username: '', oldPassword: '', newPassword: '', newPasswordRepeat: '' };

        ctrl.changePassword = changePassword;
        ctrl.fieldHasError = fieldHasError;

        function changePassword() {
            if (!ctrl.changePasswordForm.$valid) {
                return popupService.getPopup('session.invalidDataError');
            }
            loadingService.show(SessionMessages.loading.changingPassword, null);
            sessionService.changePassword(ctrl.user)
                .then(successChangePassword)
                .catch(errorChangePassword);
        }

        function errorChangePassword() {
            loadingService.hide();
            popupService.getPopup('session.invalidCredentialsError');
        }

        function fieldHasError(field) {
            return ctrl.changePasswordForm[field].$invalid &&
                (ctrl.changePasswordForm[field].$touched || ctrl.changePasswordForm.$submitted);
        }

        function successChangePassword() {
            loadingService.hide();
            sessionService.goToLogin();
        }
    }
})();

