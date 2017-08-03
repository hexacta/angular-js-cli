(function () {
    'use strict';
    angular.module('<%=module=%>')
        .factory('<%=name=%>Service', <%=name=%>Service);

    <%=name=%>Service.$inject = ['$log'];

    function <%=name=%>Service($log) {
        var time = new Date().toJSON()
                            .slice(0, 10);

        var service = { log: log };

        return service;

        function log(message) {
            $log.info(time + message);

            return time + message;
        }
    }
})();
