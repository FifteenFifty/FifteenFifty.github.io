import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  assignPerson(from, to, count) {
    if ((count > 0 && from.free >= count) ||
         (count < 0 && to.total >= count)) {
        to.total += count
        to.free  += count
        from.free -= count
    }
  }

  data = {
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
}
