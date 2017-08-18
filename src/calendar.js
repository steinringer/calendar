(function() {
    'use strict';

    angular.module('calendar', []);
        
    angular.module('calendar').constant('calendarConstants', Object.freeze({
        DAY: 1,
        WEEK: 2
    }));

    angular.module('calendar').directive('dayView', [
        function() {

            function populateHourSections(element) {
                for(var i = 0; i < 24; i++) {
                    var hourDiv = document.createElement('div');
                    hourDiv.setAttribute('data-hour', i);
                    element[0].appendChild(hourDiv);
                }
            }

            return {
                //templateUrl: '/src/templates/dayView.html',
                link: function(scope, element, attrs) {
                    populateHourSections(element);
                }
            }
        }
    ]);

    angular.module('calendar').directive('calendar', [
        'calendarConstants','$compile',
        function(calendarConstants, $compile) {

            return {
                scope: {
                    options: '='
                },
                link: function(scope, element, attrs) {
                    scope.$watch('options.mode',
                    function(newVal) {
                        var template;
                        switch(newVal) {
                            case calendarConstants.DAY:
                                template = '<day-view />';
                                break;
                        }

                        var view = $compile(template)(scope);
                        element.append(view);
                    })
                }
            }
        }
    ]);
})();