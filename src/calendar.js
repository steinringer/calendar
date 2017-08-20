(function() {
    'use strict';

    angular.module('calendar', []);

    angular.module('calendar').factory('collisionDetection', [

        function() {
            function detect(intervals) {
                var result = [];

                // todo replace with _
                intervals = intervals.splice(0).sort(function(a,b) {
                    return a.from > b.from;
                });

                while(intervals.length) {

                    var group = {
                        from: intervals[0].from,
                        intervals: []
                    };
                    result.push(group);
                    
                    for(var i = 0; i < intervals.length; i++) {
                        group.to = intervals[i].to;
                        if (intervals[i].from < intervals[0].to)  {
                            group.intervals.push(intervals[i]);
                            if (intervals.length === 1) {
                                intervals.splice(0, 1);
                                break;
                            }
                        }
                        else {
                            intervals.splice(0, i);
                            break;
                        }
                    }
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

            function calculatePosition(date) {
                var totalMillis = 86400000;

                var start = date;
                var startDay = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate());
                
                return ((start.getTime() - startDay.getTime()) / totalMillis) * 100.0;
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
                scope: false,
                link: function(scope, element, attrs) {
                    element[0].classList.add('day-view');
                    populateHourSections(element, scope);

                    var intervalGroups = collisionDetection.detect(scope.intervals);

                    scope.positionedIntervals = [];

                    angular.forEach(intervalGroups, function(group) {
                        var width = 100.0 / group.intervals.length;

                        angular.forEach(group.intervals, function(interval, idx) {
                            var startPercentage = calculatePosition(interval.from);                            
                            var endPercentage = calculatePosition(interval.to) - startPercentage;
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

                    console.log(scope.positionedIntervals);
                }
            }
        }
    ]);

    angular.module('calendar').factory('weekOperations', [

        function() {
            function getPreviousStartOfWeek(date) {
                while (date.getDay() != 1) {
                    var millisYesterday = date.getTime() - 3600000;
                    date = new Date(millisYesterday);
                }

                date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                return date;
            }

            return {
                getPreviousStartOfWeek: getPreviousStartOfWeek
            };
        }
    ]);
    angular.module('calendar').directive('calendar', [
        'calendarConstants','$compile', 'weekOperations',
        function(calendarConstants, $compile, weekOperations) {

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
                        var dayViewScope = scope.$new();
                        dayViewScope.intervals = scope.options.data.filter(function(i) {
                            var sd = new Date(
                                scope.options.selectedDate.getFullYear(),
                                scope.options.selectedDate.getMonth(),
                                scope.options.selectedDate.getDate()
                            );

                            var sdTommorow = new Date(
                                sd.getFullYear(),
                                sd.getMonth(),
                                sd.getDate() + 1
                            )

                            return i.to > sd && i.from < sdTommorow;
                            
                        });

                        var view = $compile(template)(dayViewScope);
                        element.append(view);
                    })
                }
            }
        }
    ]);
})();