(function() {
    'use strict';

    angular.module('calendar', []);

    angular.module('calendar').directive('calendar', [
        'calendarConstants','$compile', 'weekOperations',
        function(calendarConstants, $compile, weekOperations) {

            function initializeIntervals(date, intervals) {
                
                var selectedDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                );

                var selectedDateTommorow = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate() + 1
                );
                
                var filteredIntervals = intervals.filter(function(i) {
                    return i.to > selectedDate && i.from < selectedDateTommorow;
                    
                }).map(function(i) {
                    if (i.from < selectedDate) {
                        i.from = selectedDate;
                    }
                    if (i.to > selectedDateTommorow) {
                        i.to = selectedDateTommorow;
                    }
                    return i;
                });

                return {
                    date: selectedDate,
                    intervals: filteredIntervals
                };
            }

            return {
                templateUrl: '/src/templates/calendar.html',
                scope: {
                    options: '='
                },
                link: function(scope, element, attrs) {
                    scope.dayIntervals = [];
                    if (scope.options.mode === calendarConstants.DAY) {
                        scope.dayIntervals.push(initializeIntervals(scope.options.selectedDate, scope.options.data));
                    }
                    else {
                        var weekSpan = weekOperations.getWeekSpan(scope.options.selectedDate);
                        angular.forEach(weekSpan, function(day) {
                            scope.dayIntervals.push(initializeIntervals(day, scope.options.data));
                        });
                    }
                }
            }
        }
    ]);
})();