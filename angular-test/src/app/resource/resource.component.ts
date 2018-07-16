import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css'],
})
export class ResourceComponent implements OnInit {

    data = {}
    dataService = null

  constructor(dataService: DataService) {
    this.data = dataService.data
    this.dataService = dataService
  }

  ngOnInit() {
  }

}
