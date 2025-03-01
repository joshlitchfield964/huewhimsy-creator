
import { supabase } from "@/integrations/supabase/client";
import { DAILY_LIMIT_REGISTERED, PLAN_BASIC_LIMIT, PLAN_PRO_LIMIT } from './constants';

export const registeredUserService = {
  // Check if registered user has an active subscription
  async checkSubscription(userId: string) {
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (subscriptionError) {
      console.error('Error checking subscription:', subscriptionError);
      return null;
    }
    
    return subscriptionData && subscriptionData.length > 0 ? subscriptionData[0] : null;
  },
  
  // Check if registered user has free generations available
  async checkFreeGenerationAvailability(userId: string): Promise<boolean> {
    // First check if user has a paid subscription
    const subscription = await this.checkSubscription(userId);
    if (subscription) {
      // Paid users always have generation available (subject to monthly limit)
      return true;
    }
    
    // For free registered users, check daily limit
    const today = new Date().toISOString().split('T')[0];
    
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
  },

  // Record a new generation for registered user
  async recordGeneration(userId: string): Promise<void> {
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
  },

  // Get monthly usage for registered user
  async getMonthlyUsage(userId: string) {
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM format
    const { data, error } = await supabase
      .from('generation_stats')
      .select('monthly_count')
      .eq('user_id', userId)
      .gte('created_at', `${currentMonth}-01`) // First day of current month
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error) {
      console.error('Error getting monthly usage:', error);
      return 0;
    }
    
    return data && data.length > 0 ? data[0].monthly_count : 0;
  },

  // Get user generation statistics
  async getGenerationStats(userId: string) {
    // First check if user has a paid subscription
    const subscription = await this.checkSubscription(userId);
    const isPaidUser = !!subscription;
    
    // Calculate monthly limit based on subscription
    const monthlyLimit = isPaidUser ? 
      (subscription.plan_price === 5 ? PLAN_BASIC_LIMIT : PLAN_PRO_LIMIT) : 
      null;
    
    // Get daily usage
    const today = new Date().toISOString().split('T')[0];
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
    
    // If no stats yet
    if (!data || data.length === 0) {
      return {
        count: 0,
        lastGeneratedAt: null,
        remainingToday: isPaidUser ? 999 : DAILY_LIMIT_REGISTERED,
        freeGenerationAvailable: true,
        isPaidUser,
        monthlyLimit,
        remainingMonthly: monthlyLimit // No generations used yet
      };
    }

    // Calculate stats based on last record
    const lastRecord = data[0];
    const lastGeneratedDate = new Date(lastRecord.created_at).toISOString().split('T')[0];
    const isToday = lastGeneratedDate === today;
    
    // For paid users, check monthly limit
    let remainingMonthly = null;
    if (isPaidUser && monthlyLimit !== null) {
      const monthlyUsage = await this.getMonthlyUsage(userId);
      remainingMonthly = Math.max(0, monthlyLimit - monthlyUsage);
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
  }
};
