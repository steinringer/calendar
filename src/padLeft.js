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