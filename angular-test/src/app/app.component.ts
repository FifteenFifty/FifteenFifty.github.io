import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title       = 'Angular App Test';

  constructor(private dataService: DataService) {
  }

  UiUpdate(dataService) {
    var tps = 1/100;
    var tickScale = 1/6000; // Tick every 10ms, and 1 second = 1 minutes

    var moreExplored =
           dataService.exploreSpeed(dataService.data.explore.resource.people.total) * tickScale;

    dataService.lastAreaKms += moreExplored

    dataService.data.explore.areas.forEach(
        function(area, index) {
            area.durationSpent += (area.people.total + area.people.robots) * tps

            if (area.durationSpent > area.duration) {
                area.durationSpent = 0
                area.ticksSpent += 1

                dataService.data.resource.food     += area.resource.food
                dataService.data.resource.water    += area.resource.water
                dataService.data.resource.currency += area.resource.currency

                if (area.ticksSpent > area.ticks) {
                    // Finished - remove all assigned people, robots, and
                    // the area
                    dataService.data.people.free                      += area.people.total
                    dataService.data.overmind.autoExplore.people.free += area.people.robots
                    dataService.data.explore.areas.splice(index, 1)
                    dataService.data.stats.explored[area.name]++
                }
            }
        });

        //More people explore faster, with diminishing returns
        dataService.data.explore.progress.current += moreExplored
  };

  EventTrigger(dataService) {
    if (dataService.data.explore.resource.people.total > 0 &&
        dataService.lastAreaKms > Math.random() * dataService.maxAreaKms) {
        dataService.addArea(1)
        dataService.lastAreaKms = 0
    }

    // If there are free exploring robots, assign them
    var unexplored = dataService.data.explore.areas.some(
        function(area) {
            return (area.people.total + area.people.robots) == 0;
        });

    dataService.data.explore.areas.some(
        function(area) {
        /** If we're only assigning to unexplored, then skip in progress areas */
            if ((unexplored == ((area.people.total + area.people.robots) == 0)) &&
                dataService.data.overmind.autoExplore.people.free > 0) {

                area.people.robots++
                dataService.data.overmind.autoExplore.people.free--
            }

            return dataService.data.overmind.autoExplore.people.free == 0
        });

    var workers = dataService.data.people.total - dataService.data.people.free

    dataService.data.resource.food  -= workers
    dataService.data.resource.water -= workers
  };


  ngOnInit() {
      setInterval(this.UiUpdate, 10, this.dataService);
      setInterval(this.EventTrigger, 1000, this.dataService);
  }
}
