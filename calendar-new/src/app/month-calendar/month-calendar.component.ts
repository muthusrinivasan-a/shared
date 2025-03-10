import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CalendarEvent {
  id: number;
  eventTitle: string;
  startDateTime: Date;
  endDateTime: Date;
  isFullDayEvent: boolean;
  description: string;
  color?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
  dayEvents: DayEvent[];
  overflowCount?: number;
  hasOverflow?: boolean;
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
  selector: 'app-month-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './month-calendar.component.html',
  styleUrl: './month-calendar.component.scss',
})
export class MonthCalendarComponent implements OnInit, OnChanges {
  @Input() events: CalendarEvent[] = [];
  
  currentDate: Date = new Date();
  calendarDays: CalendarDay[] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  constructor() { }

  ngOnInit(): void {
    this.generateCalendarDays();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events']) {
      // Convert string dates to Date objects if needed
      this.events = this.events.map(event => ({
        ...event,
        startDateTime: event.startDateTime instanceof Date ? 
          event.startDateTime : new Date(event.startDateTime),
        endDateTime: event.endDateTime instanceof Date ? 
          event.endDateTime : new Date(event.endDateTime)
      }));
      
      this.generateCalendarDays();
    }
  }

  getMonthName(month: number): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
  }
  
  formatEventTime(date: Date): string {
    if (!date) return '';
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
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
        dayEvents: []
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      this.calendarDays.push({
        date,
        isCurrentMonth: true,
        events: [],
        dayEvents: []
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
        dayEvents: []
      });
    }
    
    if (this.events.length > 0) {
      // Sort events to ensure consistent rendering (longer events first)
      const sortedEvents = [...this.events].sort((a, b) => {
        // First sort by start date
        const startDiff = a.startDateTime.getTime() - b.startDateTime.getTime();
        if (startDiff !== 0) return startDiff;
        
        // If same start date, sort by duration (longer events first)
        const aDuration = a.endDateTime.getTime() - a.startDateTime.getTime();
        const bDuration = b.endDateTime.getTime() - b.startDateTime.getTime();
        return bDuration - aDuration;
      });
      
      // Assign events to days
      this.calendarDays.forEach(day => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);
        
        sortedEvents.forEach(event => {
          const startDate = new Date(event.startDateTime);
          const endDate = new Date(event.endDateTime);
          
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
    // Create a map to track event segments by week
    const eventSegmentsByWeek = new Map<number, EventSegment[]>();
    
    // First, identify all multi-day events and create their week segments
    this.events.forEach(event => {
      const eventStartDay = new Date(event.startDateTime);
      eventStartDay.setHours(0, 0, 0, 0);
      
      const eventEndDay = new Date(event.endDateTime);
      eventEndDay.setHours(0, 0, 0, 0);
      
      // Skip if not a multi-day event
      if (eventStartDay.getTime() === eventEndDay.getTime()) {
        return;
      }
      
      // Find start and end day indices in the calendar
      let startDayIndex = -1;
      let endDayIndex = -1;
      
      for (let i = 0; i < days.length; i++) {
        const dayDate = new Date(days[i].date);
        dayDate.setHours(0, 0, 0, 0);
        
        if (dayDate.getTime() === eventStartDay.getTime()) {
          startDayIndex = i;
        }
        
        if (dayDate.getTime() === eventEndDay.getTime()) {
          endDayIndex = i;
        }
      }
      
      // If we found the event days in the calendar
      if (startDayIndex >= 0 && endDayIndex >= 0) {
        // Split the event into week segments
        const endWeek = Math.floor(endDayIndex / 7);
        
        for (let weekIdx = Math.floor(startDayIndex / 7); weekIdx <= endWeek; weekIdx++) {
          const weekStart = weekIdx * 7;
          const weekEnd = weekStart + 6;
          
          const segmentStartIdx = Math.max(startDayIndex, weekStart);
          const segmentEndIdx = Math.min(endDayIndex, weekEnd);
          
          // Add segment to the tracking map
          if (!eventSegmentsByWeek.has(weekIdx)) {
            eventSegmentsByWeek.set(weekIdx, []);
          }
          
          eventSegmentsByWeek.get(weekIdx)?.push({
            event,
            startIndex: segmentStartIdx,
            endIndex: segmentEndIdx,
            daySpan: segmentEndIdx - segmentStartIdx + 1,
            position: -1, // Will be assigned later
            isEventStart: segmentStartIdx === startDayIndex
          });
        }
      }
    });
    
    // Process each week separately
    for (let weekIdx = 0; weekIdx < Math.ceil(days.length / 7); weekIdx++) {
      const weekStart = weekIdx * 7;
      const weekEnd = Math.min(weekStart + 6, days.length - 1);
      
      // Positions grid for this week (will grow as needed)
      const positionTracks: Array<Array<number | null>> = [];
      
      // Process multi-day event segments in this week (if any)
      if (eventSegmentsByWeek.has(weekIdx)) {
        // Sort segments - start day first, then by length (longer first)
        const segments = eventSegmentsByWeek.get(weekIdx)?.sort((a, b) => {
          // First by start index
          if (a.startIndex !== b.startIndex) return a.startIndex - b.startIndex;
          // Then by length (longer first)
          return b.daySpan - a.daySpan;
        }) || [];
        
        // Assign positions to segments
        for (const segment of segments) {
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
            for (let dayIdx = segment.startIndex; dayIdx <= segment.endIndex; dayIdx++) {
              const relativeDay = dayIdx - weekStart;
              if (relativeDay >= 0 && relativeDay < 7 && positionTracks[position][relativeDay] !== null) {
                positionFound = false;
                break;
              }
            }
            
            if (!positionFound) {
              position++;
            }
          }
          
          // Mark position as taken
          for (let dayIdx = segment.startIndex; dayIdx <= segment.endIndex; dayIdx++) {
            const relativeDay = dayIdx - weekStart;
            if (relativeDay >= 0 && relativeDay < 7) {
              positionTracks[position][relativeDay] = segment.event.id;
            }
          }
          
          // Store the segment with its position
          segment.position = position;
          
          // Add event to the first day of the segment
          days[segment.startIndex].dayEvents.push({
            event: segment.event,
            position: position,
            daySpan: segment.daySpan,
            isMultiDay: true,
            isStart: segment.isEventStart,
            weekSegment: true
          });
        }
      }
      
      // Now add single-day events
      for (let dayIdx = weekStart; dayIdx <= weekEnd; dayIdx++) {
        if (dayIdx >= days.length) break;
        
        const day = days[dayIdx];
        const relativeDay = dayIdx - weekStart;
        
        // Get single-day events for this day
        const singleDayEvents = day.events.filter(event => {
          const eventStartDay = new Date(event.startDateTime);
          eventStartDay.setHours(0, 0, 0, 0);
          
          const eventEndDay = new Date(event.endDateTime);
          eventEndDay.setHours(0, 0, 0, 0);
          
          return eventStartDay.getTime() === eventEndDay.getTime();
        });
        
        // Assign positions
        for (const event of singleDayEvents) {
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
            weekSegment: false
          });
        }
      }
    }
    
    // Calculate visible events and overflow count for each day
    this.calculateVisibleEvents();
  }
  
  // New method to calculate visible events and overflow count
  calculateVisibleEvents(): void {
    // Maximum number of events to display before showing "view more"
    const maxVisibleEvents = 3;
    
    // Process each day
    this.calendarDays.forEach(day => {
      // Sort dayEvents by position (top to bottom)
      day.dayEvents.sort((a, b) => a.position - b.position);
      
      // Calculate max visible height based on cell height
      // Each event takes 28px vertical space (20px height + 8px spacing)
      const maxVisiblePosition = 3; // Limit to the first 3 position slots
      
      // Count events that will be visible based on position
      const visibleEvents = day.dayEvents.filter(event => event.position < maxVisiblePosition);
      
      // Count overflow events
      const overflowCount = day.dayEvents.length - visibleEvents.length;
      
      // Add overflow info to the day
      (day as any).overflowCount = overflowCount > 0 ? overflowCount : 0;
      (day as any).hasOverflow = overflowCount > 0;
    });
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
