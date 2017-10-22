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
        ]);