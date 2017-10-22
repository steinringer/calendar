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