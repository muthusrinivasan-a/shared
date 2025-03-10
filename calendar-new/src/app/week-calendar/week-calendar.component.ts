// week-calendar.component.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

const eventSegmentsByWeek = new Map<number, Array<{
  event: CalendarEvent;
  startIndex: number;
  endIndex: number;
  daySpan: number;
  position: number;
  isEventStart: boolean;
}>>();

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
  isToday: boolean;
  events: CalendarEvent[];
  allDayEvents: EventPosition[];
  timeSlotEvents: any[];
  overflowCount?: number;
}

interface EventPosition {
  event: CalendarEvent;
  colStart: number;
  colSpan: number;
  width: number;
  left: number;
  position: number;
  isStart: boolean;
  isAllDay: boolean;
}

@Component({
  selector: 'app-week-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './week-calendar.component.html',
  styleUrls: ['./week-calendar.component.scss']
})

export class WeekCalendarComponent implements OnInit, OnChanges {
  @Input() events: CalendarEvent[] = [];
  
  currentDate: Date = new Date();
  weekDays: CalendarDay[] = [];
  weekStart: Date = new Date();
  weekEnd: Date = new Date();
  
  // Time grid settings
  dayStartHour: number = 0; // 12 AM (midnight)
  dayEndHour: number = 23; // 11 PM
  hourHeight: number = 60; // Height in px for one hour
  timeSlots: string[] = [];
  
  // Track all-day event positions across the week
  private weekPositionTracks: Map<number, boolean[]> = new Map();
  
  constructor() { 
    this.initTimeSlots();
  }

  ngOnInit(): void {
    this.generateWeekDays();
    this.processEvents();
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
      
      this.generateWeekDays();
      this.processEvents();
    }
  }
  
  // Configure the height of the time grid for full-day display
  initTimeSlots(): void {
    this.timeSlots = [];
    // Ensure we create time slots for all hours
    for (let hour = 0; hour <= 23; hour++) {
      const hourStr = hour < 12 ? 
        (hour === 0 ? '12 AM' : `${hour} AM`) : 
        (hour === 12 ? '12 PM' : `${hour-12} PM`);
      this.timeSlots.push(hourStr);
    }
  }
  
  getTimeSlotTop(hour: number): number {
    const hourIndex = Math.floor(hour);
    return hourIndex * this.hourHeight;
  }
  
  generateWeekDays(): void {
    this.weekDays = [];
    
    // Find the first day of the week (Sunday)
    const currentDay = new Date(this.currentDate);
    const dayOfWeek = currentDay.getDay();
    
    // Set to beginning of the week (Sunday)
    currentDay.setDate(currentDay.getDate() - dayOfWeek);
    this.weekStart = new Date(currentDay);
    
    // Generate 7 days of the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDay);
      date.setDate(currentDay.getDate() + i);
      
      // Check if this is today
      const today = new Date();
      const isToday = date.getDate() === today.getDate() && 
                     date.getMonth() === today.getMonth() && 
                     date.getFullYear() === today.getFullYear();
      
      this.weekDays.push({
        date,
        isToday,
        events: [],
        allDayEvents: [],
        timeSlotEvents: []
      });
    }
    
    // Set week end date
    this.weekEnd = new Date(this.weekStart);
    this.weekEnd.setDate(this.weekStart.getDate() + 6);
    this.weekEnd.setHours(23, 59, 59, 999); // Set to the end of the day
    
    // Reset position tracking for the week
    this.weekPositionTracks = new Map();
  }
  
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  }
  
  formatMonth(): string {
    // If week spans two months, show both
    const startMonth = this.weekStart.toLocaleDateString('en-US', { month: 'long' });
    const endMonth = this.weekEnd.toLocaleDateString('en-US', { month: 'long' });
    const year = this.weekStart.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${year}`;
    } else {
      return `${startMonth} - ${endMonth} ${year}`;
    }
  }
  
  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  
  prevWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.generateWeekDays();
    this.processEvents();
  }
  
  nextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.generateWeekDays();
    this.processEvents();
  }
  
  processEvents(): void {
    // Clear existing events
    this.weekDays.forEach(day => {
      day.events = [];
      day.allDayEvents = [];
      day.timeSlotEvents = [];
    });
    
    // Assign events to days
    const sortedEvents = [...this.events].sort((a, b) => {
      // First sort by start date
      return a.startDateTime.getTime() - b.startDateTime.getTime();
    });
    
    sortedEvents.forEach(event => {
      const startDate = new Date(event.startDateTime);
      const endDate = new Date(event.endDateTime);
      
      // Check if this event is within the current week
      if (startDate <= this.weekEnd && endDate >= this.weekStart) {
        // Find all days this event spans
        this.weekDays.forEach((day, index) => {
          const dayDate = new Date(day.date);
          dayDate.setHours(0, 0, 0, 0);
          
          const nextDay = new Date(dayDate);
          nextDay.setDate(nextDay.getDate() + 1);
          
          // Check if this day is within the event range
          if ((dayDate >= startDate && dayDate < endDate) || 
              (startDate >= dayDate && startDate < nextDay)) {
            day.events.push(event);
          }
        });
      }
    });
    
    // Process events for display
    this.processWeekEvents();
  }
  
  processWeekEvents(): void {
    // First pass - identify and pre-process all all-day events for consistent positioning
    const allDayEventInfos: Map<number, { event: CalendarEvent, position: number }> = new Map();
    let maxPosition = 0;
    
    // First, process all all-day events to assign consistent positions across the week
    this.weekDays.forEach((day, dayIndex) => {
      // Split events into all-day and time-specific
      const allDayEvents = day.events.filter(event => 
        event.isFullDayEvent || 
        this.isMultiDayEvent(event.startDateTime, event.endDateTime)
      );
      
      allDayEvents.forEach(event => {
        if (!allDayEventInfos.has(event.id)) {
          // Assign a new position for this event
          const position = this.findAvailablePosition(event);
          allDayEventInfos.set(event.id, { event, position });
          
          if (position > maxPosition) {
            maxPosition = position;
          }
        }
      });
    });
    
    // Now process each day's events using the consistent positions
    this.weekDays.forEach((day, dayIndex) => {
      // Split events into all-day and time-specific
      const allDayEvents = day.events.filter(event => 
        event.isFullDayEvent || 
        this.isMultiDayEvent(event.startDateTime, event.endDateTime)
      );
      
      const timeSlotEvents = day.events.filter(event => 
        !event.isFullDayEvent && 
        !this.isMultiDayEvent(event.startDateTime, event.endDateTime)
      );
      
      // Process all-day events
      this.processAllDayEvents(allDayEvents, dayIndex, allDayEventInfos);
      
      // Process time-specific events
      this.processTimeSlotEvents(timeSlotEvents, day);
    });
  }
  
  isMultiDayEvent(startDate: Date, endDate: Date): boolean {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    
    // Compare date strings to make sure we're comparing dates, not times
    return start.toDateString() !== end.toDateString();
  }
  
  findAvailablePosition(event: CalendarEvent): number {
    // Find which days this event spans in the current week
    const startDate = new Date(event.startDateTime);
    const endDate = new Date(event.endDateTime);
    
    // Calculate event duration spanning the current week
    const weekStartClone = new Date(this.weekStart);
    const weekEndClone = new Date(this.weekEnd);
    weekStartClone.setHours(0, 0, 0, 0);
    weekEndClone.setHours(23, 59, 59, 999);
    
    const effectiveStart = startDate < weekStartClone ? weekStartClone : startDate;
    const effectiveEnd = endDate > weekEndClone ? weekEndClone : endDate;
    
    // Find which day indices in the week this event spans
    const dayIndices: number[] = [];
    for (let i = 0; i < this.weekDays.length; i++) {
      const dayDate = new Date(this.weekDays[i].date);
      dayDate.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(dayDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      if ((dayDate >= effectiveStart && dayDate < effectiveEnd) || 
          (effectiveStart >= dayDate && effectiveStart < nextDay)) {
        dayIndices.push(i);
      }
    }
    
    // Find the first available position that's free across all the days this event spans
    let position = 0;
    let foundPosition = false;
    
    while (!foundPosition) {
      let positionAvailable = true;
      
      // Check if this position is available across all days
      for (const dayIndex of dayIndices) {
        // Get the tracks for this day
        let dayTracks = this.weekPositionTracks.get(dayIndex);
        if (!dayTracks) {
          dayTracks = [];
          this.weekPositionTracks.set(dayIndex, dayTracks);
        }
        
        // Expand array if needed
        while (dayTracks.length <= position) {
          dayTracks.push(false);
        }
        
        // Check if this position is already occupied
        if (dayTracks[position]) {
          positionAvailable = false;
          break;
        }
      }
      
      if (positionAvailable) {
        foundPosition = true;
        
        // Mark this position as occupied for all days this event spans
        for (const dayIndex of dayIndices) {
          const dayTracks = this.weekPositionTracks.get(dayIndex)!;
          dayTracks[position] = true;
        }
      } else {
        position++;
      }
    }
    
    return position;
  }
  
  processAllDayEvents(events: CalendarEvent[], dayIndex: number, 
                      allDayEventInfos: Map<number, { event: CalendarEvent, position: number }>): void {
    // Clear previous all-day events for this day
    this.weekDays[dayIndex].allDayEvents = [];
    
    // First, identify all multi-day events that include this day
    events.forEach(event => {
      const startDate = new Date(event.startDateTime);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(event.endDateTime);
      endDate.setHours(0, 0, 0, 0);
      
      // Current day as date
      const currentDay = new Date(this.weekDays[dayIndex].date);
      currentDay.setHours(0, 0, 0, 0);
      
      // If this event includes the current day
      if (currentDay >= startDate && currentDay <= endDate) {
        // Determine if this is the start day of the event
        const isStart = currentDay.getTime() === startDate.getTime();
        
        // Only add to this day's all-day events if it's the start day of the event
        // OR if it's the first day of the week for a continuing event
        const isFirstDayOfWeek = dayIndex === 0;
        
        if (isStart || isFirstDayOfWeek) {
          // For start day, calculate span to the end of the event or week
          // For continuing events on first day of week, calculate span from current day to end of event or week
          
          // Calculate how many days this event spans from here to end of week
          const remainingDays = 7 - dayIndex;
          
          // Calculate days until the event ends
          let dayDiff;
          if (isStart) {
            // If start day, calculate from start to end
            dayDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          } else {
            // If continuing, calculate from current day to end
            dayDiff = Math.floor((endDate.getTime() - currentDay.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          }
          
          // Use the smaller of days remaining in week or days until event ends
          const daySpan = Math.min(remainingDays, dayDiff);
          
          // Get the position from the pre-calculated map
          const eventInfo = allDayEventInfos.get(event.id);
          const position = eventInfo ? eventInfo.position : 0;
          
          // Add to this day's all-day events
          this.weekDays[dayIndex].allDayEvents.push({
            event,
            colStart: dayIndex,
            colSpan: daySpan,
            width: 100, // This will be calculated in the template
            left: 0,
            position: position,
            isStart: isStart,
            isAllDay: true
          });
        }
      }
    });
    
    // Sort all-day events by position to maintain consistent vertical order
    this.weekDays[dayIndex].allDayEvents.sort((a, b) => {
      return a.position - b.position;
    });
    
    // Calculate overflow for all-day events (if more than 3)
    if (this.weekDays[dayIndex].allDayEvents.length > 3) {
      this.weekDays[dayIndex].overflowCount = this.weekDays[dayIndex].allDayEvents.length - 3;
    }
  }
  
  processTimeSlotEvents(events: CalendarEvent[], day: CalendarDay): void {
    // Group events by time slots to handle overlapping
    const timeGroups = this.groupOverlappingEvents(events);
    
    // Process each group of overlapping events
    timeGroups.forEach(group => {
      const groupSize = group.length;
      
      // Process each event in the group
      group.forEach((event, index) => {
        const startDate = new Date(event.startDateTime);
        const endDate = new Date(event.endDateTime);
        
        // Calculate hours properly from 0-23
        const startHour = startDate.getHours() + startDate.getMinutes() / 60;
        const endHour = endDate.getHours() + endDate.getMinutes() / 60;
        
        // Calculate position and height - directly using the 24-hour value
        const top = startHour * this.hourHeight;
        
        // Calculate height and account for padding (10px top+bottom padding)
        const durationInHours = endHour - startHour;
        const height = Math.max((durationInHours * this.hourHeight) - 10, 25); // Subtract padding, ensure minimal height
        
        // Calculate width and position for overlapping events
        const eventWidth = 90 / groupSize; // Divide available width by number of events in group
        const eventLeft = 5 + (index * eventWidth); // Position events side by side
        
        day.timeSlotEvents.push({
          event,
          top,
          height,
          width: eventWidth,
          left: eventLeft,
          groupIndex: index,
          groupSize: groupSize
        });
      });
    });
  }
  
  // Helper method to group overlapping events
  groupOverlappingEvents(events: CalendarEvent[]): CalendarEvent[][] {
    if (events.length <= 1) return [events];
    
    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => 
      a.startDateTime.getTime() - b.startDateTime.getTime()
    );
    
    const groups: CalendarEvent[][] = [];
    let currentGroup: CalendarEvent[] = [];
    
    sortedEvents.forEach(event => {
      // If this is the first event or it overlaps with the current group
      if (currentGroup.length === 0 || this.doesEventOverlapWithGroup(event, currentGroup)) {
        currentGroup.push(event);
      } else {
        // This event doesn't overlap with the current group
        // Start a new group
        groups.push([...currentGroup]);
        currentGroup = [event];
      }
    });
    
    // Add the last group if not empty
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    
    return groups;
  }
  
  // Check if an event overlaps with any event in a group
  doesEventOverlapWithGroup(event: CalendarEvent, group: CalendarEvent[]): boolean {
    return group.some(groupEvent => this.doEventsOverlap(event, groupEvent));
  }
  
  // Check if two events overlap in time
  doEventsOverlap(event1: CalendarEvent, event2: CalendarEvent): boolean {
    return (
      (event1.startDateTime < event2.endDateTime && event1.endDateTime > event2.startDateTime) ||
      (event2.startDateTime < event1.endDateTime && event2.endDateTime > event1.startDateTime)
    );
  }
}