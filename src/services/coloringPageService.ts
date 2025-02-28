
import { supabase } from "@/integrations/supabase/client";

export interface ColoringPage {
  id: string;
  imageUrl: string;
  prompt: string;
  likes: number;
  isPublic: boolean;
  createdAt: string;
  userId: string;
}

export const coloringPageService = {
  // Save a new coloring page
  async saveColoringPage({
    imageUrl,
    prompt,
    isPublic = true,
  }: {
    imageUrl: string;
    prompt: string;
    isPublic?: boolean;
  }): Promise<ColoringPage | null> {
    try {
      const { data, error } = await supabase
        .from("coloring_pages")
        .insert({
          image_url: imageUrl,
          prompt,
          is_public: isPublic,
        })
        .select()
        .single();

      if (error) throw error;
      
      return data ? {
        id: data.id,
        imageUrl: data.image_url,
        prompt: data.prompt,
        likes: data.likes,
        isPublic: data.is_public,
        createdAt: data.created_at,
        userId: data.user_id,
      } : null;
    } catch (error) {
      console.error("Error saving coloring page:", error);
      return null;
    }
  },

  // Get all public coloring pages for the gallery
  async getPublicColoringPages(): Promise<ColoringPage[]> {
    try {
      const { data, error } = await supabase
        .from("coloring_pages")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(page => ({
        id: page.id,
        imageUrl: page.image_url,
        prompt: page.prompt,
        likes: page.likes,
        isPublic: page.is_public,
        createdAt: page.created_at,
        userId: page.user_id,
      }));
    } catch (error) {
      console.error("Error fetching public coloring pages:", error);
      return [];
    }
  },

  // Get user's coloring page history
  async getUserColoringPages(): Promise<ColoringPage[]> {
    try {
      const { data, error } = await supabase
        .from("coloring_pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(page => ({
        id: page.id,
        imageUrl: page.image_url,
        prompt: page.prompt,
        likes: page.likes,
        isPublic: page.is_public,
        createdAt: page.created_at,
        userId: page.user_id,
      }));
    } catch (error) {
      console.error("Error fetching user coloring pages:", error);
      return [];
    }
  },

  // Like a coloring page
  async likeColoringPage(id: string): Promise<boolean> {
    try {
      const { data: page, error: fetchError } = await supabase
        .from("coloring_pages")
        .select("likes")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from("coloring_pages")
        .update({ likes: (page.likes || 0) + 1 })
        .eq("id", id);

      if (updateError) throw updateError;
      
      return true;
    } catch (error) {
      console.error("Error liking coloring page:", error);
      return false;
    }
  },

  // Delete a coloring page
  async deleteColoringPage(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("coloring_pages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error deleting coloring page:", error);
      return false;
    }
  }
};
