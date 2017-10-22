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