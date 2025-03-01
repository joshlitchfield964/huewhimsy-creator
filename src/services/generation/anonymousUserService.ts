
// Service for handling anonymous user generation limits
import { DAILY_LIMIT_ANONYMOUS } from './constants';

export const anonymousUserService = {
  // Check if anonymous user has free generations available
  checkFreeGenerationAvailability(): boolean {
    const localGenerations = localStorage.getItem('daily_generations');
    const today = new Date().toISOString().split('T')[0];
    
    if (localGenerations) {
      try {
        const parsed = JSON.parse(localGenerations);
        if (parsed.date === today) {
          return parsed.count < DAILY_LIMIT_ANONYMOUS;
        }
      } catch (e) {
        // If there's an error parsing, reset the counter
        localStorage.setItem('daily_generations', JSON.stringify({ date: today, count: 0 }));
        return true;
      }
    }
    
    // Initialize counter if it doesn't exist
    localStorage.setItem('daily_generations', JSON.stringify({ date: today, count: 0 }));
    return true;
  },

  // Record a new generation for anonymous user
  recordGeneration(): void {
    const localGenerations = localStorage.getItem('daily_generations');
    const today = new Date().toISOString().split('T')[0];
    
    if (localGenerations) {
      try {
        const parsed = JSON.parse(localGenerations);
        if (parsed.date === today) {
          parsed.count += 1;
          localStorage.setItem('daily_generations', JSON.stringify(parsed));
        } else {
          // New day
          localStorage.setItem('daily_generations', JSON.stringify({ date: today, count: 1 }));
        }
      } catch (e) {
        // If there's an error parsing, reset the counter
        localStorage.setItem('daily_generations', JSON.stringify({ date: today, count: 1 }));
      }
    } else {
      // Initialize counter if it doesn't exist
      localStorage.setItem('daily_generations', JSON.stringify({ date: today, count: 1 }));
    }
  },

  // Get anonymous user generation statistics
  getGenerationStats() {
    const localGenerations = localStorage.getItem('daily_generations');
    const today = new Date().toISOString().split('T')[0];
    let count = 0;
    
    if (localGenerations) {
      try {
        const parsed = JSON.parse(localGenerations);
        if (parsed.date === today) {
          count = parsed.count;
        }
      } catch (e) {
        // If there's an error parsing, reset the counter
        localStorage.setItem('daily_generations', JSON.stringify({ date: today, count: 0 }));
      }
    } else {
      // Initialize counter if it doesn't exist
      localStorage.setItem('daily_generations', JSON.stringify({ date: today, count: 0 }));
    }
    
    return {
      count,
      lastGeneratedAt: null,
      remainingToday: DAILY_LIMIT_ANONYMOUS - count,
      freeGenerationAvailable: count < DAILY_LIMIT_ANONYMOUS,
      isPaidUser: false,
      monthlyLimit: null,
      remainingMonthly: null
    };
  }
};
