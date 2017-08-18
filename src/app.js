(function() {
    'use strict';

    angular.module('calendar', []);
    
    
    angular.module('calendar').directive('calendar', [
        function() {

            return {
                scope: {
                    options: '='
                },
                link: function(scope, element, attrs) {
                    console.log(scope.options);
                }
            }
        }
    ]);


    angular.module('app', ['calendar'])
    .controller('appCtrl', [
        '$scope',
        function($scope) {
            $scope.options = {
                data: [
                    {from: new Date(2017, 7, 18, 12, 0, 0), to:new Date(2017, 7, 18, 14, 0, 0), title: "foo" },
                    {from: new Date(2017, 7, 18, 15, 0, 0), to:new Date(2017, 7, 18, 18, 0, 0), title: "bar" }
                ]
            };
        }
    ])

    angular.bootstrap(document.body, ['app']);
})();