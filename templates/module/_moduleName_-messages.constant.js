(function () {
    'use strict';

    var <%=name=%>Messages = {
        namespace: '<%=name=%>',
        popups: {
            'generalError': {
                isError: true,
                title: 'Application Error',
                body: 'We were unable to complete the requested action. ' +
                'Please try again later.'

            },
            'generalErrorWithId': {
                isError: true,
                title: 'Application Error',
                body: 'We were unable to complete the requested action. ' +
                'Please open a ticket and include the error id: ?1'
            },
            'generalAPIError': {
                isError: true,
                title: 'Application Error',
                body: '?1'
            }
        }
    };

    angular
        .module('<%=module=%>')
        .constant('<%=Name=%>Messages', <%=name=%>Messages);
})();
