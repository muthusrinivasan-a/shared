// month-calendar.component.ts
import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";

export interface CalendarEvent {
  id: number;
  title: string;
  startDate: Date | string;
  endDate?: Date | string;
  isFullDay?: boolean;
  description?: string;
  color?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
  dayEvents: DayEvent[];
  overflowCount: number;
  hasOverflow: boolean;
}

interface DayEvent {
  event: CalendarEvent;
  position: number;
  daySpan: number;
  isMultiDay: boolean;
  isStart: boolean;
  weekSegment: boolean;
}

interface EventSegment {
  event: CalendarEvent;
  startIndex: number;
  endIndex: number;
  daySpan: number;
  position: number;
  isEventStart: boolean;
}

@Component({
  selector: "app-month-calendar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./month-calendar.component.html",
  styleUrl: "./month-calendar.component.scss",
})
export class MonthCalendarComponent implements OnInit, OnDestroy {
  events: CalendarEvent[] = [];
  private subscription = new Subscription();

  currentDate: Date = new Date();
  calendarDays: CalendarDay[] = [];
  weekDays: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  constructor() {}

  ngOnInit(): void {
    this.generateCalendarDays();

    // Add your event service subscription here
    // this.subscription.add(
    //   this.eventService.getEvents().subscribe(events => {
    //     // Normalize the events with proper date handling
    //     this.events = events.map(event => this.normalizeEvent(event));
    //     this.generateCalendarDays();
    //   })
    // );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Helper method to normalize event data
  private normalizeEvent(event: any): CalendarEvent {
    const normalizedEvent: CalendarEvent = {
      id: event.id,
      title: event.title || "",
      startDate:
        event.startDate instanceof Date
          ? event.startDate
          : new Date(event.startDate),
      description: event.description || "",
      color: event.color,
      isFullDay: event.isFullDay || false,
    };

    // Handle endDate - if not provided, use startDate
    if (event.endDate) {
      normalizedEvent.endDate =
        event.endDate instanceof Date ? event.endDate : new Date(event.endDate);
    } else {
      // If endDate is not provided, use startDate (same day event)
      normalizedEvent.endDate = normalizedEvent.startDate;
    }

    return normalizedEvent;
  }

  getMonthName(month: number): string {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month];
  }

  formatEventTime(date: Date | string): string {
    if (!date) return "";

    const dateObj = date instanceof Date ? date : new Date(date);

    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  generateCalendarDays(): void {
    this.calendarDays = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Get first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Get the day of week (0-6)
    const firstWeekDay = firstDayOfMonth.getDay();

    // Get last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Get last day of the previous month
    const lastDayOfPrevMonth = new Date(year, month, 0);
    const prevMonthDays = lastDayOfPrevMonth.getDate();

    // Add days from previous month to fill the first week
    for (let i = 0; i < firstWeekDay; i++) {
      const day = prevMonthDays - firstWeekDay + i + 1;
      const date = new Date(year, month - 1, day);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        events: [],
        dayEvents: [],
        overflowCount: 0,
        hasOverflow: false,
      });
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      this.calendarDays.push({
        date,
        isCurrentMonth: true,
        events: [],
        dayEvents: [],
        overflowCount: 0,
        hasOverflow: false,
      });
    }

    // Calculate how many days we need from next month
    const remainingDays = 42 - this.calendarDays.length; // 6 rows * 7 days = 42

    // Add days from next month
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        events: [],
        dayEvents: [],
        overflowCount: 0,
        hasOverflow: false,
      });
    }

    if (this.events.length > 0) {
      // Sort events to ensure consistent rendering (longer events first)
      const sortedEvents = [...this.events].sort((a, b) => {
        // First sort by start date
        const aStart =
          a.startDate instanceof Date ? a.startDate : new Date(a.startDate);
        const bStart =
          b.startDate instanceof Date ? b.startDate : new Date(b.startDate);
        const startDiff = aStart.getTime() - bStart.getTime();
        if (startDiff !== 0) return startDiff;

        // If same start date, sort by duration (longer events first)
        const aEnd =
          a.endDate instanceof Date
            ? a.endDate
            : new Date(a.endDate || a.startDate);
        const bEnd =
          b.endDate instanceof Date
            ? b.endDate
            : new Date(b.endDate || b.startDate);
        const aDuration = aEnd.getTime() - aStart.getTime();
        const bDuration = bEnd.getTime() - bStart.getTime();
        return bDuration - aDuration;
      });

      // Assign events to days
      this.calendarDays.forEach((day) => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);

        sortedEvents.forEach((event) => {
          const startDate =
            event.startDate instanceof Date
              ? event.startDate
              : new Date(event.startDate);
          const endDate =
            event.endDate instanceof Date
              ? event.endDate
              : new Date(event.endDate || event.startDate);

          const startDay = new Date(startDate);
          startDay.setHours(0, 0, 0, 0);

          const endDay = new Date(endDate);
          endDay.setHours(0, 0, 0, 0);

          // Check if the current day is within the event range
          if (dayDate >= startDay && dayDate <= endDay) {
            day.events.push(event);
          }
        });
      });

      // Process events for each week to determine positions
      this.processEventsPositions();
    }
  }

  // Process events positions with week boundary support
  processEventsPositions(): void {
    const days = this.calendarDays;

    // Process each week separately
    for (let weekIdx = 0; weekIdx < Math.ceil(days.length / 7); weekIdx++) {
      const weekStart = weekIdx * 7;
      const weekEnd = Math.min(weekStart + 6, days.length - 1);

      // Step 1: Find all multi-day events for this week
      const multiDayEvents: EventSegment[] = [];

      // Collect all multi-day events visible in this week
      for (let dayIdx = weekStart; dayIdx <= weekEnd; dayIdx++) {
        const day = days[dayIdx];

        day.events.forEach((event) => {
          const startDate =
            event.startDate instanceof Date
              ? event.startDate
              : new Date(event.startDate);
          const endDate =
            event.endDate instanceof Date
              ? event.endDate
              : new Date(event.endDate || event.startDate);

          const eventStartDay = new Date(startDate);
          eventStartDay.setHours(0, 0, 0, 0);

          const eventEndDay = new Date(endDate);
          eventEndDay.setHours(0, 0, 0, 0);

          // Only process multi-day events
          if (eventStartDay.getTime() === eventEndDay.getTime()) {
            return;
          }

          // Find the event's span within this week
          let startIndex = -1;
          let endIndex = -1;

          for (let i = weekStart; i <= weekEnd; i++) {
            const dayDate = new Date(days[i].date);
            dayDate.setHours(0, 0, 0, 0);

            // If this is the event start day or the first day of the week for an ongoing event
            if (
              dayDate.getTime() === eventStartDay.getTime() ||
              (i === weekStart &&
                dayDate > eventStartDay &&
                dayDate <= eventEndDay)
            ) {
              startIndex = i;
            }

            // If this is the event end day or the last day of the week for an ongoing event
            if (
              dayDate.getTime() === eventEndDay.getTime() ||
              (i === weekEnd &&
                dayDate >= eventStartDay &&
                dayDate < eventEndDay)
            ) {
              endIndex = i;
              break;
            }
          }

          // If we've found a valid segment in this week
          if (startIndex >= 0 && endIndex >= 0) {
            const isEventStart =
              new Date(days[startIndex].date).getTime() ===
              eventStartDay.getTime();

            multiDayEvents.push({
              event,
              startIndex,
              endIndex,
              daySpan: endIndex - startIndex + 1,
              position: -1, // Will be assigned later
              isEventStart,
            });
          }
        });
      }

      // Step 2: Sort multi-day events by start day and then by duration (longer first)
      multiDayEvents.sort((a, b) => {
        // First by start index
        if (a.startIndex !== b.startIndex) return a.startIndex - b.startIndex;
        // Then by length (longer first)
        return b.daySpan - a.daySpan;
      });

      // Step 3: Assign positions to multi-day events first
      const positionTracks: Array<Array<number | null>> = [];

      for (const segment of multiDayEvents) {
        // Find the first available position
        let position = 0;
        let positionFound = false;

        while (!positionFound) {
          positionFound = true;

          // Expand track if needed
          while (positionTracks.length <= position) {
            positionTracks.push(Array(7).fill(null));
          }

          // Check if this position is available for all days in the segment
          for (
            let dayIdx = segment.startIndex;
            dayIdx <= segment.endIndex;
            dayIdx++
          ) {
            const relativeDay = dayIdx - weekStart;
            if (positionTracks[position][relativeDay] !== null) {
              positionFound = false;
              break;
            }
          }

          if (!positionFound) {
            position++;
          }
        }

        // Mark position as taken
        for (
          let dayIdx = segment.startIndex;
          dayIdx <= segment.endIndex;
          dayIdx++
        ) {
          const relativeDay = dayIdx - weekStart;
          positionTracks[position][relativeDay] = segment.event.id;
        }

        // Assign the position to the segment
        segment.position = position;

        // Only add the event to the first day of the segment
        days[segment.startIndex].dayEvents.push({
          event: segment.event,
          position: position,
          daySpan: segment.daySpan,
          isMultiDay: true,
          isStart: segment.isEventStart,
          weekSegment: true,
        });
      }

      // Step 4: Process single-day events
      for (let dayIdx = weekStart; dayIdx <= weekEnd; dayIdx++) {
        const day = days[dayIdx];
        const relativeDay = dayIdx - weekStart;

        // Get single-day events for this day
        day.events.forEach((event) => {
          const startDate =
            event.startDate instanceof Date
              ? event.startDate
              : new Date(event.startDate);
          const endDate =
            event.endDate instanceof Date
              ? event.endDate
              : new Date(event.endDate || event.startDate);

          const eventStartDay = new Date(startDate);
          eventStartDay.setHours(0, 0, 0, 0);

          const eventEndDay = new Date(endDate);
          eventEndDay.setHours(0, 0, 0, 0);

          // Skip multi-day events (already processed)
          if (eventStartDay.getTime() !== eventEndDay.getTime()) {
            return;
          }

          // Skip events that are already in dayEvents (avoid duplicates)
          if (day.dayEvents.some((e) => e.event.id === event.id)) {
            return;
          }

          // Find first available position
          let position = 0;
          let positionFound = false;

          while (!positionFound) {
            positionFound = true;

            // Expand track if needed
            while (positionTracks.length <= position) {
              positionTracks.push(Array(7).fill(null));
            }

            if (positionTracks[position][relativeDay] !== null) {
              positionFound = false;
              position++;
            }
          }

          // Mark position as taken
          positionTracks[position][relativeDay] = event.id;

          // Add to day events
          day.dayEvents.push({
            event,
            position,
            daySpan: 1,
            isMultiDay: false,
            isStart: true,
            weekSegment: false,
          });
        });
      }
    }

    // Calculate visible events and overflow count for each day
    this.calculateVisibleEvents();
  }

  // Calculate visible events and overflow count
  calculateVisibleEvents(): void {
    // Maximum positions to display before showing "view more"
    const maxVisiblePositions = 3;

    // Process each day
    this.calendarDays.forEach((day) => {
      // Sort dayEvents by position (top to bottom)
      day.dayEvents.sort((a, b) => a.position - b.position);

      // Count events that will be visible based on position
      const visibleEvents = day.dayEvents.filter(
        (event) => event.position < maxVisiblePositions
      );

      // Calculate overflow count
      const overflowCount = day.dayEvents.length - visibleEvents.length;

      // Update day properties
      day.overflowCount = overflowCount > 0 ? overflowCount : 0;
      day.hasOverflow = overflowCount > 0;
    });
  }

  // Function to handle view more events click
  viewMoreEvents(day: CalendarDay, event: Event): void {
    event.preventDefault();
    // Implement your view more functionality here
    console.log(
      "View more events for",
      day.date,
      "Total events:",
      day.events.length
    );
  }

  prevMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateCalendarDays();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateCalendarDays();
  }
}
