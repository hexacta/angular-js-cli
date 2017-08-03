/* eslint-env node, jasmine, protractor */
/* eslint func-style:"off" */
'use strict';
var ChangePasswordPage = function() {
    var changePasswordUrl = '/#/change-password';
    var changePasswordButton = element(by.css('button')),
        loginLink = element(by.uiSref('change-password')),
        newPassword = element(by.model('$ctrl.user.newPassword')),
        newPasswordRepeat = element(by.model('$ctrl.user.newPasswordRepeat')),
        oldPassword = element(by.model('$ctrl.user.oldPassword')),
        popup = element(by.css('.popup-modal')),
        title = element(by.css('.sign-title.hidden')),
        username = element(by.model('$ctrl.user.username'));

    this.closePopup = closePopup;
    this.doChangePassword = doChangePassword;
    this.doChangePasswordWithUser = doChangePasswordWithUser;
    this.get = get;
    this.getTitle = getTitle;
    this.goToChangePassword = goToChangePassword;
    this.isCurrentView = isCurrentView;
    this.isPopupShown = isPopupShown;
    this.setNewPassword = setNewPassword;
    this.setNewPasswordRepeat = setNewPasswordRepeat;
    this.setOldPassword = setOldPassword;
    this.setUsername = setUsername;

    function closePopup() {
        if (isPopupShown()) {
            var okButton = popup.element(by.css(' button'));
            okButton.click();
        }

        return false;
    }

    function doChangePassword() {
        changePasswordButton.click();
        browser.waitForAngular();
    }

    function doChangePasswordWithUser(user) {
        setUsername(user.username);
        setOldPassword(user.oldPassword);
        setNewPassword(user.newPassword);
        setNewPasswordRepeat(user.newPasswordRepeat);
        doChangePassword();

        return isCurrentView();
    }

    function get() {
        browser.get(changePasswordUrl);
    }

    function getTitle() {
        return title.getAttribute('textContent');
    }

    function goToChangePassword() {
        loginLink.click();
        browser.waitForAngular();
    }

    function isCurrentView() {
        return browser.getCurrentUrl().then(function (browserUrl) {
            return browserUrl === browser.baseUrl + changePasswordUrl;
        });
    }

    function isPopupShown() {
        popup = element(by.css('.popup-modal'));

        return popup.isPresent();
    }

    function setNewPassword(pass) {
        newPassword.sendKeys(pass);
    }

    function setNewPasswordRepeat(pass) {
        newPasswordRepeat.sendKeys(pass);
    }

    function setOldPassword(pass) {
        oldPassword.sendKeys(pass);
    }

    function setUsername(name) {
        username.sendKeys(name);
    }
};
module.exports = ChangePasswordPage;
