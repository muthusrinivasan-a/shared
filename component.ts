import { Component } from '@angular/core';
import { CalendarService } from './calendar.service';
import { DayOfWeek } from './enums';
import { Event, TimeSlot } from './models';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  currentDate: Date = new Date();
  weekDays: string[] = this.getShortWeekDays(); // Use short weekday names
  hourSlots: TimeSlot[] = [];
  events: Event[] = [
    // Sample events data
    { name: 'Event 1', start: new Date(2023, 6, 27, 10, 15), end: new Date(2023, 6, 27, 11, 30) },
    { name: 'Event 2', start: new Date(2023, 6, 27, 13, 0), end: new Date(2023, 6, 27, 14, 45) }
    // Add more events here
  ];

  constructor(private calendarService: CalendarService) {
    this.initializeHourSlots();
  }

  initializeHourSlots() {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        this.hourSlots.push({
          hour,
          minute,
          events: this.calendarService.getEventsForSlot(this.events, hour, minute)
        });
      }
    }
  }

  previousWeek() {
    this.currentDate = this.calendarService.getPreviousWeek(this.currentDate);
    this.updateHourSlots();
  }

  nextWeek() {
    this.currentDate = this.calendarService.getNextWeek(this.currentDate);
    this.updateHourSlots();
  }

  updateHourSlots() {
    this.hourSlots.forEach(slot => {
      slot.events = this.calendarService.getEventsForSlot(this.events, slot.hour, slot.minute);
    });
  }

  // Get short weekday names
  getShortWeekDays(): string[] {
    const weekDays = Object.keys(DayOfWeek).filter(day => isNaN(Number(day)));
    return weekDays.map(day => day.substr(0, 3)); // Use the first 3 characters for short names
  }
}
