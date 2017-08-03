/* eslint-env node, jasmine, protractor */
/* eslint func-style:"off" */
'use strict';
var LoginPage = function() {
    var loginUrl = '/#/login';
    var changePasswordLink = element(by.uiSref('change-password')),
        loginButton = element(by.css('button')),
        password = element(by.model('$ctrl.user.password')),
        popup = element(by.css('.popup-modal')),
        title = element(by.css('.sign-title.hidden')),
        username = element(by.model('$ctrl.user.username'));

    this.closePopup = closePopup;
    this.doLogin = doLogin;
    this.doLoginWithUser = doLoginWithUser;
    this.get = get;
    this.getTitle = getTitle;
    this.goToChangePassword = goToChangePassword;
    this.isCurrentView = isCurrentView;
    this.isPopupShown = isPopupShown;
    this.setPassword = setPassword;
    this.setUsername = setUsername;

    function closePopup() {
        if (isPopupShown()) {
            var okButton = popup.element(by.css(' button'));
            okButton.click();
        }

        return false;
    }

    function doLogin() {
        loginButton.click();
        browser.waitForAngular();
    }

    function doLoginWithUser(user) {
        setUsername(user.username);
        setPassword(user.password);
        doLogin();

        return isCurrentView();
    }

    function get() {
        browser.get(loginUrl);
    }

    function getTitle() {
        return title.getAttribute('textContent');
    }

    function goToChangePassword() {
        changePasswordLink.click();
        browser.waitForAngular();
    }

    function isCurrentView() {
        return browser.getCurrentUrl().then(function (browserUrl) {
            return browserUrl === browser.baseUrl + loginUrl;
        });
    }

    function isPopupShown() {
        popup = element(by.css('.popup-modal'));

        return popup.isPresent();
    }

    function setPassword(pass) {
        password.sendKeys(pass);
    }

    function setUsername(name) {
        username.sendKeys(name);
    }
};
module.exports = LoginPage;
