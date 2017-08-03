(function () {
    'use strict';
    angular.module('app.session')
        .component('login', {
            templateUrl: 'app/session/components/login/login.template.html',
            controller: LoginComponentCtrl
        });

    LoginComponentCtrl.$inject = ['sessionService', 'popupService', 'loadingService'];
    function LoginComponentCtrl(sessionService, popupService, loadingService) {
        var ctrl = this;

        ctrl.user = { username: '', password: '' };

        ctrl.doLogin = doLogin;
        ctrl.fieldHasError = fieldHasError;

        function doLogin() {
            if (!ctrl.loginForm.$valid) {
                return popupService.getPopup('session.invalidDataError');
            }
            sessionService
                .doLogin(ctrl.user)
                .catch(errorLogin);
        }

        function errorLogin() {
            loadingService.hide();
            popupService.getPopup('session.invalidCredentialsError');
        }

        function fieldHasError(field) {
            return ctrl.loginForm[field].$invalid &&
                (ctrl.loginForm[field].$touched || ctrl.loginForm.$submitted);
        }
    }
})();

