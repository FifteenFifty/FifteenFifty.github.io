var app = angular.module("FalloutGame", ['ui.bootstrap']);

app.controller('IncrementalCtrl',
  function($scope, $interval) {
    $scope.data = {
        people: {
            total: 10,
            free:  10
        },
        explore: {
            resource: {
                people: {
                    total: 0
                }
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
        },
        overmind: {
            autoExplore: {
                people: {
                    total: 0,
                    free:  0
                }
            }
        },
        scavenge: {
        },
        stats: {
            explored: {
                Garage: 0,
                House:  0
            }
        }
    }

    var scavenge = {
        car: {
            name: "Car",
            resource: {
                steel:     10,
                circuitry: 1
            },
            duration:      20,
            durationSpent: 0,
            ticks:         20,
            ticksSpent:    0
        }
    }

    var areas = {
        1: {
            garage: {
                name:     "Garage",
                resource: {
                    food:     10,
                    water:    10,
                    currency: 10
                },
                scavenge: {
                    car: 0.15
                },
                duration:      5,
                durationSpent: 0,
                ticks:         3,
                ticksSpent:    0,
                people:        {
                    total:  0,
                    robots: 0
                }
            },
            house: {
                name:     "House",
                resource: {
                    food:     100,
                    water:    100,
                    currency: 100
                },
                duration:      10,
                durationSpent: 0,
                ticks:         10,
                ticksSpent:    0,
                people:        {
                    total:  0,
                    robots: 0
                }
            }
        }
    }

    lastGarageKms = 0;
    maxGarageKms  = 1;

    $scope.exploreSpeed = function(people) {
        return Math.sqrt(people) * 2.5
    }

    $scope.assignPerson = function(from, to, count) {
        if ((count > 0 && from.free >= count) ||
            (count < 0 && to.total >= count)) {
            to.total += count
            to.free  += count
            from.free -= count
        }
    }

    function AddArea(tier) {
        // Select a random area from the tier to add
        var keys = Object.keys(areas[tier])
        var toAdd = angular.copy(areas[tier][keys[Math.floor(Math.random() *
                                                  keys.length)]])

        for (let r of Object.keys(toAdd.resource)) {
            toAdd.resource[r] = Math.ceil(Math.random() * toAdd.resource[r])
        }
        $scope.data.explore.areas.push(toAdd)
    }

    // Run UI update code every 10ms
    $interval(function() {
        var tps = 1/100;
        var tickScale = 1/6000; // Tick every 10ms, and 1 second = 1 minutes

        var moreExplored =
           $scope.exploreSpeed($scope.data.explore.resource.people.total) * tickScale;

        lastGarageKms += moreExplored

        $scope.data.explore.areas.forEach(
            function(area, index) {
                area.durationSpent += (area.people.total + area.people.robots) * tps

                if (area.durationSpent > area.duration) {
                    area.durationSpent = 0
                    area.ticksSpent += 1

                    $scope.data.resource.food     += area.resource.food
                    $scope.data.resource.water    += area.resource.water
                    $scope.data.resource.currency += area.resource.currency

                    if (area.ticksSpent > area.ticks) {
                        // Finished - remove all assigned people, robots, and
                        // the area
                        $scope.data
                              .people
                              .free        += area.people.total
                        $scope.data
                              .overmind
                              .autoExplore
                              .people
                              .free        += area.people.robots
                        $scope.data.explore.areas.splice(index, 1)
                        $scope.data.stats.explored[area.name]++
                    }
                }
            });

        //More people explore faster, with diminishing returns
        $scope.data.explore.progress.current += moreExplored
    }, 10);

    // Run event triggers every second
    $interval(function() {

        if ($scope.data.explore.resource.people.total > 0 &&
            lastGarageKms > Math.random() * maxGarageKms) {
            AddArea(1)
            lastGarageKms = 0
        }

        // If there are free exploring robots, assign them
        var unexplored = $scope.data.explore.areas.some(
            function(area) {
                return (area.people.total + area.people.robots) == 0;
            });

        $scope.data.explore.areas.some(
            function(area) {
                // If we're only assigning to unexplored, then skip in progress
                // areas
                if ((unexplored == ((area.people.total + area.people.robots) == 0)) &&
                    $scope.data.overmind.autoExplore.people.free > 0) {

                    area.people.robots++
                    $scope.data.overmind.autoExplore.people.free--
                }

                return $scope.data.overmind.autoExplore.people.free == 0
            });

        var workers = $scope.data.people.total - $scope.data.people.free

        $scope.data.resource.food  -= workers
        $scope.data.resource.water -= workers
    }, 1000);
  });

