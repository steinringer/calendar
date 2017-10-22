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