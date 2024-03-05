import { Component, OnInit } from '@angular/core';
import { TimezoneService } from './timezone.service'; // Adjust the path as necessary

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userTimezone: string;

  constructor(private timezoneService: TimezoneService) {}

  ngOnInit() {
    this.userTimezone = this.timezoneService.getUserTimezone();
  }
}
