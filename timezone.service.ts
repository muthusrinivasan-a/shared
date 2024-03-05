import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {

  constructor() { }

  getUserTimezone(): string {
    // Get the timezone offset in minutes and convert it to hours
    const offset = -new Date().getTimezoneOffset() / 60;
    const sign = offset >= 0 ? '+' : '-';
    // Ensure the offset has a leading zero if necessary and is in HH:MM format
    const formattedOffset = `${sign}${Math.floor(Math.abs(offset)).toString().padStart(2, '0')}:${(Math.abs(offset) % 1 * 60).toString().padStart(2, '0')}`;

    // Get the user's timezone using Intl.DateTimeFormat API
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Combine both pieces of information
    return `${formattedOffset} (${timezone})`;
  }
}
