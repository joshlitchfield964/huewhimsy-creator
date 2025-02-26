
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserGenerationStats {
  count: number;
  lastGeneratedAt: string | null;
  remainingToday: number;
  freeGenerationAvailable: boolean;
}

export const userGenerationService = {
  // Check if the user has free generations available
  async checkFreeGenerationAvailability(): Promise<boolean> {
    try {
      // Check if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        return false;
      }

      const userId = session.session.user.id;
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      // Get the latest generation record for today
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

      // If no records for today or count is less than daily limit (1), user can generate
      return !data || data.length === 0 || data[0].daily_count < 1;
    } catch (error) {
      console.error('Error in checkFreeGenerationAvailability:', error);
      return false;
    }
  },

  // Record a new generation
  async recordGeneration(): Promise<void> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        return;
      }

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
    } catch (error) {
      console.error('Error in recordGeneration:', error);
    }
  },

  // Get user generation statistics
  async getUserGenerationStats(): Promise<UserGenerationStats | null> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        return null;
      }

      const userId = session.session.user.id;
      const today = new Date().toISOString().split('T')[0];

      // Get the latest generation record
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

      if (!data || data.length === 0) {
        return {
          count: 0,
          lastGeneratedAt: null,
          remainingToday: 1, // Free user gets 1 per day
          freeGenerationAvailable: true
        };
      }

      const lastRecord = data[0];
      const lastGeneratedDate = new Date(lastRecord.created_at).toISOString().split('T')[0];
      const isToday = lastGeneratedDate === today;

      return {
        count: lastRecord.monthly_count,
        lastGeneratedAt: lastRecord.created_at,
        remainingToday: isToday ? Math.max(0, 1 - lastRecord.daily_count) : 1,
        freeGenerationAvailable: !isToday || lastRecord.daily_count < 1
      };
    } catch (error) {
      console.error('Error in getUserGenerationStats:', error);
      return null;
    }
  }
};
