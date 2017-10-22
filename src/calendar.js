(function() {
    'use strict';

    angular.module('calendar', []);

    angular.module('calendar').factory('weekOperations', [

        function() {
            function getPreviousStartOfWeek(date) {
                while (date.getDay() != 1) {
                    var millisYesterday = date.getTime() - 86400000;
                    date = new Date(millisYesterday);
                }

                date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                return date;
            }

            function getWeekSpan(date) {
                var span = [];
                var dayInMillis = 86400000;
                var start = getPreviousStartOfWeek(date);
                var startMillis = start.getTime();

                for(var i = 0; i < 7; i++) {
                    span.push(new Date(startMillis + (dayInMillis * i)));
                }
                return span;
            }

            return {
                getPreviousStartOfWeek: getPreviousStartOfWeek,
                getWeekSpan: getWeekSpan
            };
        }
    ]);

    angular.module('calendar').factory('collisionDetection', [

        function() {
            function detect(intervals) {
                if (!intervals || !intervals.length) {
                    return null;
                }

                function newGroup(interval) {
                    var group = {
                        from: interval.from,
                        to: interval.to,
                        intervals: []
                    };
                    result.push(group);
                    return group;
                }

                var result = [];
                
                // todo replace with _
                intervals = intervals.splice(0).sort(function(a,b) {
                    return a.from > b.from;
                });
            
                var group;
                for(var i = 0; i < intervals.length; i++) {
                    if (i === 0) {
                        group = newGroup(intervals[i]);
                    }

                    if (intervals[i].from < group.to)  {
                        group.to = group.to > intervals[i].to ? group.to : intervals[i].to;
                    }
                    else {
                        group = newGroup(intervals[i]);
                    }
                    group.intervals.push(intervals[i]);
                }
                return result;

            }

            return {
                detect: detect
            };
        }
    ])
        
    angular.module('calendar').filter('duration', [
        '$filter',
        function($filter) {
            var padLeftFilter = $filter('padLeft');
            return function(interval) {
                if (interval && angular.isDate(interval.from) && angular.isDate(interval.to)) {
                    var millisDiff = interval.to.getTime() - interval.from.getTime();
                    var hours = Math.floor(millisDiff / 3600000);
                    var hoursInMillis = hours * 3600000;
                    var minutes = Math.floor((millisDiff - hoursInMillis) / 60000);

                    return padLeftFilter(hours, 2, '0') + ':' + padLeftFilter(minutes, 2, '0');
                }
                
                return interval;
            }
        }
    ]);
        
    angular.module('calendar').filter('padLeft', [
        function() {
            return function(val, noOfChars, char) {
                if (val != null) {
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
                template: '<span class="hour-row__label">{{hour | padLeft : 2 : \'0\'}}:00</span>',
                scope: true,
                link: function(scope, element, attrs) {
                    scope.hour = attrs.hour;
                }
            }
        }
    ]);

    angular.module('calendar').directive('interval', [
        function() {
            return {
                scope: true,
                templateUrl: '/src/templates/interval.html',
                link: function(scope, element, attrs) {
                    element[0].classList.add('interval');
                }
            }
        }
    ]);

    angular.module('calendar').directive('dayView', [
        '$compile', 'collisionDetection',
        function($compile, collisionDetection) {

            function calculatePosition(date, selectedDate) {
                var totalDayMillis = 86400000;

                if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
                    // till midnight
                    if (date.getDate() === selectedDate.getDate() + 1) {
                        return 100.0;
                    }
                    else {
                        return 0.0;
                    }
                }
                else {

                    var start = date;
                    var startDay = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate());
                    
                    return ((start.getTime() - startDay.getTime()) / totalDayMillis) * 100.0;
                }

                
            }
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
                templateUrl: '/src/templates/dayView.html',
                scope: true,
                link: function(scope, element, attrs) {
                    element[0].classList.add('day-view');
                    populateHourSections(element, scope);
                    
                    var intervalGroups = collisionDetection.detect(scope.dayInterval.intervals);

                    element[0].style.width = (100.0 / scope.dayIntervals.length ) + '%';
                    
                    scope.positionedIntervals = [];

                    angular.forEach(intervalGroups, function(group) {
                        var width = 100.0 / group.intervals.length;

                        angular.forEach(group.intervals, function(interval, idx) {
                            var startPercentage = calculatePosition(interval.from, scope.options.selectedDate);                            
                            var endPercentage = calculatePosition(interval.to, scope.options.selectedDate) - startPercentage;
                            var widthPercantage = width;
                            var left = (width * idx);

                            scope.positionedIntervals.push({
                                interval: interval,
                                style: {
                                    top: startPercentage + '%',
                                    height: endPercentage + '%',
                                    width: idx === 0 ? 'calc(' + width + '% - 60px)' : width + '%',
                                    left: idx === 0 ? 'calc(60px + ' + left + '%)' : left + '%'
                                }
                            });
                        });
                    });
                }
            }
        }
    ]);

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