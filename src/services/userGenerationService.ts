
import { supabase } from "@/integrations/supabase/client";
import { UserGenerationStats } from "./generation/types";
import { anonymousUserService } from "./generation/anonymousUserService";
import { registeredUserService } from "./generation/registeredUserService";

export const userGenerationService = {
  // Check if the user has free generations available
  async checkFreeGenerationAvailability(): Promise<boolean> {
    try {
      // Check if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      
      if (session?.session?.user) {
        return registeredUserService.checkFreeGenerationAvailability(session.session.user.id);
      } else {
        return anonymousUserService.checkFreeGenerationAvailability();
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
        await registeredUserService.recordGeneration(session.session.user.id);
      } else {
        anonymousUserService.recordGeneration();
      }
    } catch (error) {
      console.error('Error in recordGeneration:', error);
    }
  },

  // Get user generation statistics
  async getUserGenerationStats(): Promise<UserGenerationStats | null> {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        return anonymousUserService.getGenerationStats();
      }

      return registeredUserService.getGenerationStats(session.session.user.id);
    } catch (error) {
      console.error('Error in getUserGenerationStats:', error);
      return null;
    }
  }
};
