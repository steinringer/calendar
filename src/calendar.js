(function() {
    'use strict';

    angular.module('calendar', []);
        
    angular.module('calendar').constant('calendarConstants', Object.freeze({
        DAY: 1,
        WEEK: 2
    }));

    angular.module('calendar').directive('dayView', [
        function() {

            return {
                templateUrl: '/src/templates.dayView.html',
                link: function(scope, element, attrs) {

                }
            }
        }
    ]);

    angular.module('calendar').directive('calendar', [
        'calendarConstants',
        function(calendarConstants) {

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
})();