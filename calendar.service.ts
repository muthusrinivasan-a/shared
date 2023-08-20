import { Injectable } from '@angular/core';
import { DayOfWeek } from './enums';
import { Event } from './models';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }

  getEventsForDate(events: Event[], date: Date): Event[] {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getDate() === date.getDate()
      ) || (
        eventEnd.getFullYear() === date.getFullYear() &&
        eventEnd.getMonth() === date.getMonth() &&
        eventEnd.getDate() === date.getDate()
      );
    });
  }
}
