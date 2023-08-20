import { Injectable } from '@angular/core';
import { Event, TimeSlot } from './models';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  getEventsForSlot(events: Event[], hour: number, minute: number): Event[] {
    const startTime = new Date(0, 0, 0, hour, minute);
    const endTime = new Date(0, 0, 0, hour, minute + 15);
    return events.filter(
      event => event.start >= startTime && event.end <= endTime
    );
  }

  getPreviousWeek(date: Date): Date {
    const previousWeek = new Date(date);
    previousWeek.setDate(previousWeek.getDate() - 7);
    return previousWeek;
  }

  getNextWeek(date: Date): Date {
    const nextWeek = new Date(date);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  }
}
