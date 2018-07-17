import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  data        = {}
  dataService = null

  constructor(dataService: DataService) {
    this.data = dataService.data
    this.dataService = dataService
  }

  ngOnInit() {
  }

}
