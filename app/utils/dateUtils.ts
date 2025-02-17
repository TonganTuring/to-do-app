import { parse, addDays, isValid } from 'date-fns';

export function parseDateExpression(expression: string): Date | null {
  // Remove leading/trailing whitespace
  expression = expression.trim().toLowerCase();
  
  const today = new Date();
  
  // Handle common expressions
  switch (expression) {
    case 'today':
      return today;
    case 'tomorrow':
      return addDays(today, 1);
    case 'next week': {
      // Set to same day next week
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return nextWeek;
    }
    case 'next month': {
      // Set to same day next month, handling month boundaries
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      return nextMonth;
    }
  }
  
  // Handle day names (e.g., "monday", "tuesday", etc.)
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = days.indexOf(expression);
  if (dayIndex !== -1) {
    const currentDay = today.getDay();
    let daysUntilTarget = dayIndex - currentDay;
    
    // If the day has already passed this week, move to next week
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7;
    }
    
    return addDays(today, daysUntilTarget);
  }
  
  // Try to parse specific date formats
  const specificDateMatch = expression.match(/^([a-z]+)\s+(\d+)$/);
  if (specificDateMatch) {
    const date = parse(expression, 'MMMM d', new Date());
    if (isValid(date)) return date;
    
    const shortDate = parse(expression, 'MMM d', new Date());
    if (isValid(shortDate)) return shortDate;
  }
  
  // Handle "next tuesday" format
  const nextDayMatch = expression.match(/^next\s+([a-z]+)$/);
  if (nextDayMatch) {
    const targetDay = days.indexOf(nextDayMatch[1]);
    if (targetDay !== -1) {
      const currentDay = today.getDay();
      const daysUntilTarget = (targetDay + 7 - currentDay) % 7;
      return addDays(today, daysUntilTarget);
    }
  }
  
  return null;
} 