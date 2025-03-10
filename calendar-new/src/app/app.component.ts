import { Component } from '@angular/core';
import { MonthCalendarComponent } from './month-calendar/month-calendar.component';
import { sampleEvents, eventsJSON, convertJSONEvents, generateRandomEvents } from './events';
import { WeekCalendarComponent } from "./week-calendar/week-calendar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MonthCalendarComponent, WeekCalendarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'calendar';
  calendarEvents = sampleEvents;

}
