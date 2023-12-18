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
  
