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