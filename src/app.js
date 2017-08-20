(function() {
    'use strict';

    angular.module('app', ['calendar'])
    .controller('appCtrl', [
        '$scope', 'calendarConstants',
        function($scope, calendarConstants) {
            $scope.options = {
                selectedDate: new Date(2017, 7, 18),
                mode: calendarConstants.DAY,
                data: [
                    {from: new Date(2017, 7, 18, 12, 0, 0), to:new Date(2017, 7, 18, 14, 0, 0), title: "foo" },
                    {from: new Date(2017, 7, 18, 15, 0, 0), to:new Date(2017, 7, 18, 18, 0, 0), title: "bar" }
                ]
            };
        }
    ])

    angular.bootstrap(document.body, ['app']);
})();