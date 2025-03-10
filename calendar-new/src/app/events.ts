// events.ts - Sample events data for calendar

// Sample events with Date objects (for direct use in TypeScript)
export const sampleEvents = [
    {
      id: 1,
      eventTitle: "Regular Event",
      startDateTime: new Date(2025, 2, 2, 10, 0), // March 2, 10:00 AM
      endDateTime: new Date(2025, 2, 2, 12, 0),   // March 2, 12:00 PM
      isFullDayEvent: false,
      description: "Regular single-day event",
      color: "#4285F4"
    },
    {
      id: 2,
      eventTitle: "Multi-Day Event",
      startDateTime: new Date(2025, 2, 3, 9, 0),  // March 3, 9:00 AM
      endDateTime: new Date(2025, 2, 4, 17, 0),   // March 4, 5:00 PM
      isFullDayEvent: false,
      description: "This event spans March 3-4",
      color: "#EA4335"
    },
    {
      id: 3,
      eventTitle: "All-Day Event",
      startDateTime: new Date(2025, 2, 5, 0, 0),  // March 5, 12:00 AM
      endDateTime: new Date(2025, 2, 5, 23, 59),  // March 5, 11:59 PM
      isFullDayEvent: true,
      description: "Full day event on March 5",
      color: "#FBBC05"
    },
    {
      id: 4,
      eventTitle: "Long Event Mar 8-12",
      startDateTime: new Date(2025, 2, 8, 8, 0),   // March 8, 8:00 AM
      endDateTime: new Date(2025, 2, 12, 18, 0),   // March 12, 6:00 PM
      isFullDayEvent: false,
      description: "Long multi-day event spanning March 8-12",
      color: "#34A853"
    },
    {
      id: 5,
      eventTitle: "March 2 Meeting",
      startDateTime: new Date(2025, 2, 2, 14, 0),  // March 2, 2:00 PM
      endDateTime: new Date(2025, 2, 2, 15, 30),   // March 2, 3:30 PM
      isFullDayEvent: false,
      description: "Afternoon meeting on March 2",
      color: "#8E24AA"
    },
    {
      id: 6,
      eventTitle: "March 2 Training",
      startDateTime: new Date(2025, 2, 2, 16, 0),  // March 2, 4:00 PM
      endDateTime: new Date(2025, 2, 2, 17, 30),   // March 2, 5:30 PM
      isFullDayEvent: false,
      description: "Late afternoon training session",
      color: "#16A2D7"
    },
    {
      id: 7,
      eventTitle: "March 3 Appointment",
      startDateTime: new Date(2025, 2, 3, 11, 0),  // March 3, 11:00 AM
      endDateTime: new Date(2025, 2, 3, 12, 0),    // March 3, 12:00 PM
      isFullDayEvent: false,
      description: "Morning appointment on March 3",
      color: "#EF6C00"
    },
    {
      id: 8,
      eventTitle: "Three-Day Event",
      startDateTime: new Date(2025, 2, 2, 8, 0),   // March 2, 8:00 AM
      endDateTime: new Date(2025, 2, 4, 19, 0),    // March 4, 7:00 PM
      isFullDayEvent: false,
      description: "Event spanning March 2-4, overlapping with other events",
      color: "#2E7D32"
    },
    {
      id: 9,
      eventTitle: "Cross-Week Event",
      startDateTime: new Date(2025, 2, 1, 9, 0),   // March 1, 9:00 AM
      endDateTime: new Date(2025, 2, 7, 17, 0),    // March 7, 5:00 PM
      isFullDayEvent: false,
      description: "Event spanning from March 1 to March 7, crossing week boundary",
      color: "#FF6D00"
    },
    {
      id: 10,
      eventTitle: "End of Month Event",
      startDateTime: new Date(2025, 2, 28, 10, 0), // March 28, 10:00 AM
      endDateTime: new Date(2025, 3, 2, 17, 0),    // April 2, 5:00 PM
      isFullDayEvent: false,
      description: "Event spanning from March to April, crossing month boundary",
      color: "#9C27B0"
    },
    {
      id: 11,
      eventTitle: "Conference",
      startDateTime: new Date(2025, 2, 15, 9, 0),  // March 15, 9:00 AM
      endDateTime: new Date(2025, 2, 17, 18, 0),   // March 17, 6:00 PM
      isFullDayEvent: true,
      description: "Annual industry conference",
      color: "#607D8B"
    },
    {
      id: 12,
      eventTitle: "Team Lunch",
      startDateTime: new Date(2025, 2, 10, 12, 0), // March 10, 12:00 PM
      endDateTime: new Date(2025, 2, 10, 14, 0),   // March 10, 2:00 PM
      isFullDayEvent: false,
      description: "Monthly team lunch",
      color: "#FFC107"
    },
    {
      id: 21,
      eventTitle: "Standup Meeting",
      startDateTime: new Date(2025, 2, 10, 12, 0), // March 10, 12:00 PM
      endDateTime: new Date(2025, 2, 10, 14, 0),   // March 10, 2:00 PM
      isFullDayEvent: false,
      description: "Monthly team lunch",
      color: "#009688"
    },
    {
      id: 13,
      eventTitle: "Product Launch",
      startDateTime: new Date(2025, 2, 20, 10, 0), // March 20, 10:00 AM
      endDateTime: new Date(2025, 2, 20, 15, 0),   // March 20, 3:00 PM
      isFullDayEvent: false,
      description: "New product launch event",
      color: "#009688"
    },
    {
      id: 14,
      eventTitle: "Board Meeting",
      startDateTime: new Date(2025, 2, 25, 9, 0),  // March 25, 9:00 AM
      endDateTime: new Date(2025, 2, 25, 12, 0),   // March 25, 12:00 PM
      isFullDayEvent: false,
      description: "Quarterly board meeting",
      color: "#795548"
    },
    {
      id: 15,
      eventTitle: "Client Meeting",
      startDateTime: new Date(2025, 2, 9, 14, 30), // March 9, 2:30 PM
      endDateTime: new Date(2025, 2, 9, 16, 0),    // March 9, 4:00 PM
      isFullDayEvent: false,
      description: "Meeting with important client",
      color: "#673AB7"
    },
    {
      id: 16,
      eventTitle: "Marketing Review",
      startDateTime: new Date(2025, 2, 18, 13, 0), // March 18, 1:00 PM
      endDateTime: new Date(2025, 2, 18, 14, 30),  // March 18, 2:30 PM
      isFullDayEvent: false,
      description: "Q1 marketing campaign review",
      color: "#E91E63"
    },
    {
      id: 17,
      eventTitle: "Sales Training",
      startDateTime: new Date(2025, 2, 11, 9, 0),  // March 11, 9:00 AM
      endDateTime: new Date(2025, 2, 12, 17, 0),   // March 12, 5:00 PM
      isFullDayEvent: false,
      description: "Two-day sales training workshop",
      color: "#3F51B5"
    },
    {
      id: 18,
      eventTitle: "Project Deadline",
      startDateTime: new Date(2025, 2, 31, 0, 0),  // March 31, 12:00 AM
      endDateTime: new Date(2025, 2, 31, 23, 59),  // March 31, 11:59 PM
      isFullDayEvent: true,
      description: "Q1 project submission deadline",
      color: "#F44336"
    },
    {
      id: 19,
      eventTitle: "Team Building",
      startDateTime: new Date(2025, 2, 27, 13, 0), // March 27, 1:00 PM
      endDateTime: new Date(2025, 2, 27, 18, 0),   // March 27, 6:00 PM
      isFullDayEvent: false,
      description: "Team building activity",
      color: "#00BCD4"
    },
    {
      id: 20,
      eventTitle: "Budget Planning",
      startDateTime: new Date(2025, 2, 22, 10, 0), // March 22, 10:00 AM
      endDateTime: new Date(2025, 2, 22, 15, 0),   // March 22, 3:00 PM
      isFullDayEvent: false,
      description: "Q2 budget planning session",
      color: "#4CAF50"
    }
  ];
  
  // JSON format for the same events (for storing in a .json file or API)
  export const eventsJSON = [
    {
      "id": 1,
      "eventTitle": "Regular Event",
      "startDateTime": "2025-03-02T10:00:00",
      "endDateTime": "2025-03-02T12:00:00",
      "isFullDayEvent": false,
      "description": "Regular single-day event",
      "color": "#4285F4"
    },
    {
      "id": 2,
      "eventTitle": "Multi-Day Event",
      "startDateTime": "2025-03-03T09:00:00",
      "endDateTime": "2025-03-04T17:00:00",
      "isFullDayEvent": false,
      "description": "This event spans March 3-4",
      "color": "#EA4335"
    },
    {
      "id": 3,
      "eventTitle": "All-Day Event",
      "startDateTime": "2025-03-05T00:00:00",
      "endDateTime": "2025-03-05T23:59:00",
      "isFullDayEvent": true,
      "description": "Full day event on March 5",
      "color": "#FBBC05"
    },
    {
      "id": 4,
      "eventTitle": "Long Event Mar 8-12",
      "startDateTime": "2025-03-08T08:00:00",
      "endDateTime": "2025-03-12T18:00:00",
      "isFullDayEvent": false,
      "description": "Long multi-day event spanning March 8-12",
      "color": "#34A853"
    },
    {
      "id": 5,
      "eventTitle": "March 2 Meeting",
      "startDateTime": "2025-03-02T14:00:00",
      "endDateTime": "2025-03-02T15:30:00",
      "isFullDayEvent": false,
      "description": "Afternoon meeting on March 2",
      "color": "#8E24AA"
    },
    {
      "id": 6,
      "eventTitle": "March 2 Training",
      "startDateTime": "2025-03-02T16:00:00",
      "endDateTime": "2025-03-02T17:30:00",
      "isFullDayEvent": false,
      "description": "Late afternoon training session",
      "color": "#16A2D7"
    },
    {
      "id": 7,
      "eventTitle": "March 3 Appointment",
      "startDateTime": "2025-03-03T11:00:00",
      "endDateTime": "2025-03-03T12:00:00",
      "isFullDayEvent": false,
      "description": "Morning appointment on March 3",
      "color": "#EF6C00"
    },
    {
      "id": 8,
      "eventTitle": "Three-Day Event",
      "startDateTime": "2025-03-02T08:00:00",
      "endDateTime": "2025-03-04T19:00:00",
      "isFullDayEvent": false,
      "description": "Event spanning March 2-4, overlapping with other events",
      "color": "#2E7D32"
    },
    {
      "id": 9,
      "eventTitle": "Cross-Week Event",
      "startDateTime": "2025-03-01T09:00:00",
      "endDateTime": "2025-03-07T17:00:00",
      "isFullDayEvent": false,
      "description": "Event spanning from March 1 to March 7, crossing week boundary",
      "color": "#FF6D00"
    },
    {
      "id": 10,
      "eventTitle": "End of Month Event",
      "startDateTime": "2025-03-28T10:00:00",
      "endDateTime": "2025-04-02T17:00:00",
      "isFullDayEvent": false,
      "description": "Event spanning from March to April, crossing month boundary",
      "color": "#9C27B0"
    },
    {
      "id": 11,
      "eventTitle": "Conference",
      "startDateTime": "2025-03-15T09:00:00",
      "endDateTime": "2025-03-17T18:00:00",
      "isFullDayEvent": true,
      "description": "Annual industry conference",
      "color": "#607D8B"
    },
    {
      "id": 12,
      "eventTitle": "Team Lunch",
      "startDateTime": "2025-03-10T12:00:00",
      "endDateTime": "2025-03-10T14:00:00",
      "isFullDayEvent": false,
      "description": "Monthly team lunch",
      "color": "#FFC107"
    },
    {
      "id": 13,
      "eventTitle": "Product Launch",
      "startDateTime": "2025-03-20T10:00:00",
      "endDateTime": "2025-03-20T15:00:00",
      "isFullDayEvent": false,
      "description": "New product launch event",
      "color": "#009688"
    },
    {
      "id": 14,
      "eventTitle": "Board Meeting",
      "startDateTime": "2025-03-25T09:00:00",
      "endDateTime": "2025-03-25T12:00:00",
      "isFullDayEvent": false,
      "description": "Quarterly board meeting",
      "color": "#795548"
    },
    {
      "id": 15,
      "eventTitle": "Client Meeting",
      "startDateTime": "2025-03-09T14:30:00",
      "endDateTime": "2025-03-09T16:00:00",
      "isFullDayEvent": false,
      "description": "Meeting with important client",
      "color": "#673AB7"
    },
    {
      "id": 16,
      "eventTitle": "Marketing Review",
      "startDateTime": "2025-03-18T13:00:00",
      "endDateTime": "2025-03-18T14:30:00",
      "isFullDayEvent": false,
      "description": "Q1 marketing campaign review",
      "color": "#E91E63"
    },
    {
      "id": 17,
      "eventTitle": "Sales Training",
      "startDateTime": "2025-03-11T09:00:00",
      "endDateTime": "2025-03-12T17:00:00",
      "isFullDayEvent": false,
      "description": "Two-day sales training workshop",
      "color": "#3F51B5"
    },
    {
      "id": 18,
      "eventTitle": "Project Deadline",
      "startDateTime": "2025-03-31T00:00:00",
      "endDateTime": "2025-03-31T23:59:00",
      "isFullDayEvent": true,
      "description": "Q1 project submission deadline",
      "color": "#F44336"
    },
    {
      "id": 19,
      "eventTitle": "Team Building",
      "startDateTime": "2025-03-27T13:00:00",
      "endDateTime": "2025-03-27T18:00:00",
      "isFullDayEvent": false,
      "description": "Team building activity",
      "color": "#00BCD4"
    },
    {
      "id": 20,
      "eventTitle": "Budget Planning",
      "startDateTime": "2025-03-22T10:00:00",
      "endDateTime": "2025-03-22T15:00:00",
      "isFullDayEvent": false,
      "description": "Q2 budget planning session",
      "color": "#4CAF50"
    }
  ];
  
  // Function to convert JSON events to Calendar Event objects
  export function convertJSONEvents(jsonEvents: any[]) {
    return jsonEvents.map(event => ({
      ...event,
      startDateTime: new Date(event.startDateTime),
      endDateTime: new Date(event.endDateTime)
    }));
  }
  
  // Generate random events for testing
  export function generateRandomEvents(count: number = 20, year = new Date().getFullYear(), month = new Date().getMonth()) {
    const events = [];
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8E24AA', '#16A2D7', '#EF6C00', 
                   '#2E7D32', '#FF6D00', '#9C27B0', '#607D8B', '#FFC107', '#009688', '#795548', 
                   '#673AB7', '#E91E63', '#3F51B5', '#F44336', '#00BCD4', '#4CAF50'];
    
    for (let i = 1; i <= count; i++) {
      const startDay = Math.floor(Math.random() * 28) + 1; // 1-28
      const eventLength = Math.floor(Math.random() * 5); // 0-4 days
      const isFullDay = Math.random() > 0.7; // 30% are full day events
      
      const startHour = isFullDay ? 0 : Math.floor(Math.random() * 12) + 8; // 8AM-8PM
      const startMinute = Math.floor(Math.random() * 60);
      
      const endDay = startDay + eventLength;
      const endHour = isFullDay ? 23 : startHour + Math.floor(Math.random() * 3) + 1; // 1-3 hours
      const endMinute = Math.floor(Math.random() * 60);
      
      events.push({
        id: i,
        eventTitle: `Event ${i}`,
        startDateTime: new Date(year, month, startDay, startHour, startMinute),
        endDateTime: new Date(year, month, endDay, endHour, endMinute),
        isFullDayEvent: isFullDay,
        description: `Description for Event ${i}`,
        color: colors[i % colors.length]
      });
    }
    
    return events.sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime());
  }