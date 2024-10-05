export class DateService {

  // Get the start of the month
  getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  // Get the start of the week (assuming Sunday is the start of the week)
  getStartOfWeek(date: Date): Date {
    const day = date.getDay(); // 0 is Sunday
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  }

  // Get the next or previous month start date
  getNextOrPreviousMonthStart(date: Date, direction: 'next' | 'previous'): Date {
    const currentMonth = date.getMonth();
    const nextMonth = direction === 'next' ? currentMonth + 1 : currentMonth - 1;
    const year = date.getFullYear();
    
    // Handle the year change when moving between December and January
    const newMonthYear = new Date(year, nextMonth, 1);
    return this.getStartOfMonth(newMonthYear);
  }
}
