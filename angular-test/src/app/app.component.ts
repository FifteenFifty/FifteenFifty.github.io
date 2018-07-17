import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title       = 'Angular App Test';

  data:        {}
  dataService: null

  constructor(dataService: DataService) {
    this.data        = dataService.data
    this.dataService = dataService
  }

  UiUpdate(data, dataService) {
    var tps = 1/100;
    var tickScale = 1/6000; // Tick every 10ms, and 1 second = 1 minutes

    var moreExplored =
           dataService.exploreSpeed(data.explore.resource.people.total) * tickScale;

    dataService.lastAreaKms += moreExplored

    data.explore.areas.forEach(
        function(area, index) {
            area.durationSpent += (area.people.total + area.people.robots) * tps

            if (area.durationSpent > area.duration) {
                area.durationSpent = 0
                area.ticksSpent += 1

                data.resource.food     += area.resource.food
                data.resource.water    += area.resource.water
                data.resource.currency += area.resource.currency

                if (area.ticksSpent > area.ticks) {
                    // Finished - remove all assigned people, robots, and
                    // the area
                    data.people.free                      += area.people.total
                    data.overmind.autoExplore.people.free += area.people.robots
                    data.explore.areas.splice(index, 1)
                    data.stats.explored[area.name]++
                }
            }
        });

        //More people explore faster, with diminishing returns
        data.explore.progress.current += moreExplored
  };

  EventTrigger(data, dataService) {
    if (data.explore.resource.people.total > 0 &&
        dataService.lastAreaKms > Math.random() * dataService.maxAreaKms) {
        dataService.addArea(1)
        dataService.lastAreaKms = 0
    }

    // If there are free exploring robots, assign them
    var unexplored = data.explore.areas.some(
        function(area) {
            return (area.people.total + area.people.robots) == 0;
        });

    data.explore.areas.some(
        function(area) {
        /** If we're only assigning to unexplored, then skip in progress areas */
            if ((unexplored == ((area.people.total + area.people.robots) == 0)) &&
                data.overmind.autoExplore.people.free > 0) {

                area.people.robots++
                data.overmind.autoExplore.people.free--
            }

            return data.overmind.autoExplore.people.free == 0
        });

    var workers = data.people.total - data.people.free

    data.resource.food  -= workers
    data.resource.water -= workers
  };


  ngOnInit() {
      setInterval(this.UiUpdate, 10, this.data, this.dataService);
      setInterval(this.EventTrigger, 1000, this.data, this.dataService);
  }
}
