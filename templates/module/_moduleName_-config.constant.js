(function () {
    'use strict';

    var <%=name=%>Config = { }; // Add any module static configuration

    angular
        .module('<%=module=%>')
        .constant('<%=Name=%>Config', <%=name=%>Config);
})();
