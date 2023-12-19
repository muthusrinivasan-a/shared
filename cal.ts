@Input() events: CalendarEvent[] = [];

  // Weekdays array
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Function to generate dates in the month
  generateDates(year: number, month: number): Date[] {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const datesArray: Date[] = [];

    for (let i = 1 - firstDay; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      datesArray.push(currentDate);
    }

    return datesArray;
  }

generateDates(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const datesArray: Date[] = [];

  // Generate dates for the previous month's leftover days
  for (let i = firstDay - 1; i >= 0; i--) {
    const currentDate = new Date(year, month, -i);
    datesArray.push(currentDate);
  }

  // Generate dates for the current month
  for (let i = 1; i <= lastDay; i++) {
    const currentDate = new Date(year, month, i);
    datesArray.push(currentDate);
  }

  // Generate dates for the next month's days
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const nextMonthDays = 42 - datesArray.length; // Total days in a 6-week calendar
  for (let i = 1; i <= nextMonthDays; i++) {
    const currentDate = new Date(nextYear, nextMonth, i);
    datesArray.push(currentDate);
  }

  return datesArray;
}

getUpcomingEvents(events) {
  if (events.length === 0) {
    // No events in the list
    return "No events available";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to start of the day

  const upcomingEvents = events
    .filter(event => new Date(event) >= today) // Filter past events
    .sort((a, b) => new Date(a) - new Date(b)); // Sort events in ascending order

  if (upcomingEvents.length === 0) {
    // No upcoming events
    return "No upcoming events";
  }

  return upcomingEvents.map(event => {
    const eventDate = new Date(event);
    const timeDiff = eventDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Calculate days left
    return { eventDate: event, daysLeft };
  });
}

// In your component
upcomingEventsMessage: string | any[];

// When fetching events
this.upcomingEventsMessage = this.eventService.getUpcomingEvents(eventsArray);

// In your HTML template, you can check the type of 'upcomingEventsMessage' and display accordingly

  // Function to check if a date has an event
  hasEvent(date: Date): boolean {
    return this.events.some(
      event =>
        date >= event.startDate && date <= event.endDate
    );
  }

  <div class="calendar">
  <div class="header">
    <!-- Weekday headers -->
    <div class="weekday" *ngFor="let day of weekdays">
      {{ day }}
    </div>
  </div>
  <div class="days">
    <!-- Days in the month -->
    <div class="day" *ngFor="let date of generateDates(currentYear, currentMonth)">
      <div class="date" [ngClass]="{ 'not-current-month': date.getMonth() !== currentMonth }">
        {{ date.getDate() }}
      </div>
      <div class="events" *ngIf="hasEvent(date)">
        <!-- Display events for the date -->
        <div *ngFor="let event of events">
          <div *ngIf="date >= event.startDate && date <= event.endDate">
            {{ event.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


/* custom-calendar.component.css */
.calendar {
    /* Your calendar styles */
  }
  
  .header {
    display: flex;
    /* Header styles */
  }
  
  .weekday {
    /* Weekday header styles */
  }
  
  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    /* Days grid styles */
  }
  
  .day {
    position: relative;
    /* Day styles */
  }
  
  .date {
    /* Date styles */
  }
  
  .not-current-month {
    opacity: 0.3;
    /* Styles for dates not in the current month */
  }
  
  .events {
    /* Event styles */
  }
  
