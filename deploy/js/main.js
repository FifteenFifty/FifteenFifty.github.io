var app = angular.module("FalloutGame", ['ui.bootstrap']);

app.controller('IncrementalCtrl',
  function($scope, $interval) {
    $scope.data = {
        people: {
            total: 1,
            free:  1
        },
        explore: {
            resource: {
                people: 0
            },
            progress: {
                current: 0,
                max:     242495
            },
            areas: [
            ]
        },
        resource: {
            food:     100,
            water:    100,
            currency: 0
        }
    }

    lastGarageKms = 0;
    maxGarageKms  = 1;

    $scope.exploreSpeed = function(people) {
        return Math.sqrt(people) * 2.5
    }

    $scope.assignPerson = function(where) {
        if ($scope.data.people.free > 0) {
            where.people++
            $scope.data.people.free--
        }
    }

    $scope.retractPerson = function(where) {
        if (where.people > 0) {
            where.people--
            $scope.data.people.free++
        }
    }

    function AddArea(tier) {
        $scope.data.explore.areas.push(
            {
                name:     "Garage",
                resource: {
                    food:     100,
                    water:    100,
                    currency: 100
                },
                duration:      2,
                durationSpent: 0,
                ticks:         5,
                ticksSpent:    0,
                people:        0
            }
        )
    }

    // Run UI update code every 10ms
    $interval(function() {
        var tickScale = 1/6000; // Tick every 10ms, and 1 second = 1 minutes

        var moreExplored =
           $scope.exploreSpeed($scope.data.explore.resource.people) * tickScale;

        lastGarageKms += moreExplored


        //More people explore faster, with diminishing returns
        $scope.data.explore.progress.current += moreExplored
    }, 10);

    // Run event triggers every second
    $interval(function() {

        if ($scope.data.explore.resource.people > 0 &&
            lastGarageKms > Math.random() * maxGarageKms) {
            AddArea(1)
            lastGarageKms = 0
        }

        $scope.data.resource.food  -= $scope.data.explore.resource.people
        $scope.data.resource.water -= $scope.data.explore.resource.people

        $scope.data.explore.areas.forEach(
            function(area, index) {
                area.durationSpent += area.people

                if (area.durationSpent > area.duration) {
                    area.durationSpent = 0
                    area.ticksSpent += 1
            //TODO - assign resources
                    if (area.ticksSpent > area.ticks) {
                        // Finished - remove all people and the area
                        while (area.people > 0) {
                            $scope.retractPerson(area)
                        }
                        $scope.data.explore.areas.splice(index, 1)
                    }
                }
            });

    }, 1000);
  });

