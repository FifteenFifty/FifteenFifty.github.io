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

    // Run UI update code every 10ms
    $interval(function() {
        var tickScale = 1/6000; // Tick every 10ms, and 1 second = 1 minutes

        var moreExplored =
           $scope.exploreSpeed($scope.data.explore.resource.people) * tickScale;


        //More people explore faster, with diminishing returns
        $scope.data.explore.progress.current += moreExplored

        lastGarageKms += moreExplored

        if (lastGarageKms > Math.random() * maxGarageKms / tickScale) {
            $scope.data.explore.areas.push({name: "garage"})
            lastGarageKms = 0
        }


    }, 10);
  });

