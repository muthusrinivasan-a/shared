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
  weekDays: string[] = this.getShortWeekDays();
  hourSlots: TimeSlot[] = [];
  events: Event[] = [
    { name: 'Event 1', start: new Date(2023, 6, 27, 10, 15), end: new Date(2023, 6, 27, 11, 30) },
    { name: 'Event 2', start: new Date(2023, 6, 27, 13, 0), end: new Date(2023, 6, 27, 14, 45) }
    // Add more events here
  ];

  constructor(private calendarService: CalendarService) {
    this.initializeHourSlots();
  }

  initializeHourSlots() {
    const startOfWeek = this.getStartOfWeek(this.currentDate);

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + day);
      const currentDayEvents = this.calendarService.getEventsForDate(this.events, currentDate);

      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          this.hourSlots.push({
            date: new Date(currentDate),
            hour,
            minute,
            events: this.getEventsForSlot(currentDayEvents, hour, minute)
          });
        }
      }
    }
  }

  getEventsForSlot(events: Event[], hour: number, minute: number): Event[] {
    const slotStart = new Date();
    slotStart.setHours(hour, minute, 0, 0);

    const slotEnd = new Date();
    slotEnd.setHours(hour, minute + 15, 0, 0);

    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (
        eventStart >= slotStart && eventStart < slotEnd
      ) || (
        eventEnd > slotStart && eventEnd <= slotEnd
      ) || (
        eventStart <= slotStart && eventEnd >= slotEnd
      );
    });
  }

  getShortWeekDays(): string[] {
    const weekDays = Object.keys(DayOfWeek).filter(day => isNaN(Number(day)));
    return weekDays.map(day => day.substr(0, 3));
  }

  getStartOfWeek(date: Date): Date {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return startOfWeek;
  }
}
