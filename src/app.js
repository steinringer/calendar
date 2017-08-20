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
                    {from: new Date(2017, 7, 18, 8, 0, 0), to:new Date(2017, 7, 18, 8, 43, 0), title: "abc" },
                    {from: new Date(2017, 7, 18, 12, 0, 0), to:new Date(2017, 7, 18, 14, 0, 0), title: "foo" },
                    {from: new Date(2017, 7, 18, 13, 0, 0), to:new Date(2017, 7, 18, 14, 30, 0), title: "collision" },
                    {from: new Date(2017, 7, 18, 11, 0, 0), to:new Date(2017, 7, 18, 12, 30, 0), title: "collision 2" },
                    {from: new Date(2017, 7, 18, 11, 0, 0), to:new Date(2017, 7, 18, 16, 30, 0), title: "huge" },
                    {from: new Date(2017, 7, 18, 15, 0, 0), to:new Date(2017, 7, 18, 18, 0, 0), title: "bar" },
                    {from: new Date(2017, 7, 19, 15, 0, 0), to:new Date(2017, 7, 18, 18, 0, 0), title: "xyz" },
                ]
            };
        }
    ])

    angular.bootstrap(document.body, ['app']);
})();