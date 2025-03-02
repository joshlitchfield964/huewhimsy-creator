
// Define the core ColoringPage type
export interface ColoringPage {
  id: string;
  imageUrl: string;
  prompt: string;
  likes: number;
  isPublic: boolean;
  createdAt: string;
  userId: string;
}

// Define the service interface
export interface ColoringPageService {
  saveColoringPage(params: {
    imageUrl: string;
    prompt: string;
    isPublic?: boolean;
  }): Promise<ColoringPage | null>;
  
  getPublicColoringPages(): Promise<ColoringPage[]>;
  
  getUserColoringPages(): Promise<ColoringPage[]>;
  
  likeColoringPage(id: string): Promise<boolean>;
  
  deleteColoringPage(id: string): Promise<boolean>;
}
