
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserGenerationStats {
  count: number;
  lastGeneratedAt: string | null;
  remainingToday: number;
  freeGenerationAvailable: boolean;
  isPaidUser: boolean;
  monthlyLimit: number | null;
  remainingMonthly: number | null;
}

export const userGenerationService = {
  // Check if the user has free generations available
  async checkFreeGenerationAvailability(): Promise<boolean> {
    try {
      // Check if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      
      // Set daily limits based on user status
      const DAILY_LIMIT_ANONYMOUS = 3;  // Non-registered users: 3 per day
      const DAILY_LIMIT_REGISTERED = 5; // Free registered users: 5 per day
      
      // First check if user has a paid subscription
      if (session?.session?.user) {
        const userId = session.session.user.id;
        
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (subscriptionData && subscriptionData.length > 0) {
          // Paid users always have generation available (subject to monthly limit)
          return true;
        }
      }
      
      // For anonymous or free registered users, check daily limit
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      // Get the latest generation record for today
      if (session?.session?.user) {
        // For registered users
        const userId = session.session.user.id;
        const { data, error } = await supabase
          .from('generation_stats')
          .select('*')
          .eq('user_id', userId)
          .gte('created_at', today)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error checking generation availability:', error);
          return false;
        }

        // If no records for today or count is less than daily limit, user can generate
        return !data || data.length === 0 || data[0].daily_count < DAILY_LIMIT_REGISTERED;
      } else {
        // For anonymous users, use localStorage to track generations
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
      }
    } catch (error) {
      console.error('Error in checkFreeGenerationAvailability:', error);
      return false;
    }
  },

  // Record a new generation
  async recordGeneration(): Promise<void> {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        // For registered users
        const userId = session.session.user.id;
        const today = new Date().toISOString().split('T')[0];

        // Get the latest generation record for today
        const { data, error } = await supabase
          .from('generation_stats')
          .select('*')
          .eq('user_id', userId)
          .gte('created_at', today)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error recording generation:', error);
          return;
        }

        if (!data || data.length === 0) {
          // First generation today
          await supabase
            .from('generation_stats')
            .insert({
              user_id: userId,
              daily_count: 1,
              monthly_count: 1
            });
        } else {
          // Update existing record
          await supabase
            .from('generation_stats')
            .update({
              daily_count: data[0].daily_count + 1,
              monthly_count: data[0].monthly_count + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', data[0].id);
        }
      } else {
        // For anonymous users, update localStorage
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
      }
    } catch (error) {
      console.error('Error in recordGeneration:', error);
    }
  },

  // Get user generation statistics
  async getUserGenerationStats(): Promise<UserGenerationStats | null> {
    try {
      const DAILY_LIMIT_ANONYMOUS = 3;  // Non-registered users: 3 per day
      const DAILY_LIMIT_REGISTERED = 5; // Free registered users: 5 per day
      
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        // For anonymous users
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
          count: count,
          lastGeneratedAt: null,
          remainingToday: DAILY_LIMIT_ANONYMOUS - count,
          freeGenerationAvailable: count < DAILY_LIMIT_ANONYMOUS,
          isPaidUser: false,
          monthlyLimit: null,
          remainingMonthly: null
        };
      }

      const userId = session.session.user.id;
      const today = new Date().toISOString().split('T')[0];

      // First check if user has a paid subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (subscriptionError) {
        console.error('Error checking subscription:', subscriptionError);
      }
      
      const isPaidUser = subscriptionData && subscriptionData.length > 0;
      const monthlyLimit = isPaidUser ? 
        (subscriptionData[0].plan_price === 5 ? 300 : 500) : // 5$ plan: 300 images, 8$ plan: 500 images
        null;
      
      // Get the generation stats
      const { data, error } = await supabase
        .from('generation_stats')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error getting user generation stats:', error);
        return null;
      }
      
      // Calculate stats based on user type
      if (!data || data.length === 0) {
        // No stats yet
        return {
          count: 0,
          lastGeneratedAt: null,
          remainingToday: isPaidUser ? 999 : DAILY_LIMIT_REGISTERED, // Free user gets 5 per day, paid users unlimited daily
          freeGenerationAvailable: true,
          isPaidUser,
          monthlyLimit,
          remainingMonthly: monthlyLimit // No generations used yet
        };
      }

      const lastRecord = data[0];
      const lastGeneratedDate = new Date(lastRecord.created_at).toISOString().split('T')[0];
      const isToday = lastGeneratedDate === today;
      
      // For paid users, check monthly limit
      let remainingMonthly = null;
      if (isPaidUser && monthlyLimit !== null) {
        // Get the current month's usage
        const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM format
        const { data: monthData, error: monthError } = await supabase
          .from('generation_stats')
          .select('monthly_count')
          .eq('user_id', userId)
          .gte('created_at', `${currentMonth}-01`) // First day of current month
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (!monthError && monthData && monthData.length > 0) {
          remainingMonthly = Math.max(0, monthlyLimit - monthData[0].monthly_count);
        } else {
          remainingMonthly = monthlyLimit; // If no data for this month, full limit available
        }
      }

      return {
        count: lastRecord.monthly_count,
        lastGeneratedAt: lastRecord.created_at,
        remainingToday: isPaidUser ? 999 : (isToday ? Math.max(0, DAILY_LIMIT_REGISTERED - lastRecord.daily_count) : DAILY_LIMIT_REGISTERED),
        freeGenerationAvailable: isPaidUser ? true : (!isToday || lastRecord.daily_count < DAILY_LIMIT_REGISTERED),
        isPaidUser,
        monthlyLimit,
        remainingMonthly
      };
    } catch (error) {
      console.error('Error in getUserGenerationStats:', error);
      return null;
    }
  }
};
