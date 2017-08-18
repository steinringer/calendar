(function() {
    'use strict';

    angular.module('calendar', []);
        
    angular.module('calendar').filter('padLeft', [
        function() {
            return function(val, noOfChars, char) {
                if (val) {
                    val = val.toString();
                    while(val.length < noOfChars) {
                        val = char + val;
                    }
                }
                
                return val;
            }
        }
    ]);

    angular.module('calendar').constant('calendarConstants', Object.freeze({
        DAY: 1,
        WEEK: 2
    }));

    angular.module('calendar').directive('hourRow', [
        function() {

            return {
                template: '<span>{{hour | padLeft : 2 : \'0\'}}</span>',
                scope: true,
                link: function(scope, element, attrs) {
                    scope.hour = attrs.hour;
                }
            }
        }
    ]);

    angular.module('calendar').directive('dayView', [
        '$compile',
        function($compile) {

            function populateHourSections(element, scope) {

                for(var i = 0; i < 24; i++) {
                    var hourDiv = document.createElement('hour-row');
                    hourDiv.setAttribute('data-hour', i);
                    hourDiv.classList.add('day-view__hour');
                    var compiledElement = $compile(hourDiv)(scope);
                    element.append(compiledElement);
                }
            }

            return {
                //templateUrl: '/src/templates/dayView.html',
                link: function(scope, element, attrs) {
                    element[0].classList.add('day-view');
                    populateHourSections(element, scope);
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
                    element[0].classList.add('day-view');

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