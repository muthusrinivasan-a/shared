export interface Event {
    name: string;
    start: Date;
    end: Date;
  }
  
  export interface TimeSlot {
    hour: number;
    minute: number;
    events: Event[];
  }
  