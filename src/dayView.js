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