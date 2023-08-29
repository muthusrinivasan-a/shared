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
  hourSlots: TimeSlot[][] = [];
  events: Event[] = [
    { name: 'Event 1', start: new Date(2023, 6, 27, 10, 15), end: new Date(2023, 6, 27, 11, 30) },
    { name: 'Event 2', start: new Date(2023, 6, 27, 13, 0), end: new Date(2023, 6, 27, 14, 45) }
    // Add more events here
  ];

  constructor(private calendarService: CalendarService) {
    this.initializeHourSlots();
  }

  // initializeHourSlots() {
  //   const startOfWeek = this.getStartOfWeek(this.currentDate);
  
  //   for (let day = 0; day < 7; day++) {
  //     const currentDate = new Date(startOfWeek);
  //     currentDate.setDate(startOfWeek.getDate() + day);
  //     const currentDayEvents = this.calendarService.getEventsForDate(this.events, currentDate);
  
  //     for (let hour = 0; hour < 24; hour++) {
  //       for (let minute = 0; minute < 60; minute += 15) {
  //         this.hourSlots.push({
  //           date: new Date(currentDate),
  //           hour,
  //           minute,
  //           events: this.getEventsForSlot(currentDayEvents, currentDate, hour, minute)
  //         });
  //       }
  //     }
  //   }
  // }

  initializeDayTimeSlots() {
    const startOfWeek = this.getStartOfWeek(this.currentDate);

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + day);

      const daySlots: TimeSlot[] = [];

      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const eventsForSlot = this.getEventsForSlot(currentDate, hour, minute);
          if (eventsForSlot.length > 0) {
            daySlots.push({
              date: new Date(currentDate),
              hour,
              minute,
              events: eventsForSlot
            });
          }
        }
      }

      this.dayTimeSlots.push(daySlots);
    }
  }


  getEventsForSlot(date: Date, hour: number, minute: number): Event[] {
    const slotStart = new Date(date);
    slotStart.setHours(hour, minute, 0, 0);
  
    const slotEnd = new Date(date);
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
  

  getDayOfMonth(index: number): string {
    const currentDate = new Date(this.currentDate);
    currentDate.setDate(currentDate.getDate() + index);
    return currentDate.getDate().toString();
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

  updateWeek(selectedDate: Date): void {
    const currentDay = selectedDate.getDay(); // 0 (Sunday) to 6 (Saturday)

    this.startOfWeek = new Date(selectedDate);
    this.startOfWeek.setDate(selectedDate.getDate() - currentDay); // Set to the first day of the week (Sunday)

    this.endOfWeek = new Date(selectedDate);
    this.endOfWeek.setDate(selectedDate.getDate() + (6 - currentDay)); // Set to the last day of the week (Saturday)
  }

  onPreviousWeek(): void {
    const previousWeek = new Date(this.startOfWeek);
    previousWeek.setDate(this.startOfWeek.getDate() - 7); // Move back by 7 days
    this.updateWeek(previousWeek);
  }

  onNextWeek(): void {
    const nextWeek = new Date(this.startOfWeek);
    nextWeek.setDate(this.startOfWeek.getDate() + 7); // Move forward by 7 days
    this.updateWeek(nextWeek);
  }

  prevWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.initializeHourSlots();
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.initializeHourSlots();
  }

  showEvent(event: Event, slot: TimeSlot): boolean {
    const eventStart = new Date(event.start);
    const currentTime = new Date(slot.date);
    currentTime.setHours(slot.hour, slot.minute, 0, 0);
  
    return eventStart >= currentTime;
  }

  calculateEventHeight(event: Event): number {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const eventDuration = (eventEnd.getTime() - eventStart.getTime()) / (15 * 60 * 1000); // Convert to 15-minute slots
    return eventDuration * 30; // 30 pixels per 15-minute slot
  }
  
  calculateEventTop(event: Event): number {
    const eventStart = new Date(event.start);
    const currentTime = new Date(eventStart);
    currentTime.setHours(eventStart.getHours(), eventStart.getMinutes(), 0, 0);
    const slotDuration = 15; // Time slot duration in minutes (15-minute slots)
    const minutesFromSlotStart = (eventStart.getTime() - currentTime.getTime()) / (15 * 60 * 1000); // Convert to 15-minute slots
    return minutesFromSlotStart * 30; // 30 pixels per 15-minute slot
  }
  
  calculateEventLeft(slot: TimeSlot): number {
    const slotDuration = 15; // Time slot duration in minutes (15-minute slots)
    return slotDuration * slot.minute / 15 * 30; // 30 pixels per 15-minute slot
  }

  generateCalendar(startMonth: number) {
    this.months = [];
    for (let i = startMonth; i < startMonth + 3; i++) {
      const monthName = this.getMonthName(i);
      const daysInMonth = new Date(new Date().getFullYear(), i + 1, 0).getDate();
      const dates = Array.from({ length: daysInMonth }, (_, idx) => {
        const date = idx + 1;
        // Simulating events for demonstration
        const events = this.generateRandomEvents(); // You need to implement this function
        return { date, events };
      });
      this.months.push({ name: monthName, dates: dates });
    }
  }
}
