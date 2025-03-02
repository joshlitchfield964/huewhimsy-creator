
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const API_ENDPOINT = "wss://ws-api.runware.ai/v1";

export type AgeGroup = "toddler" | "preschool" | "school" | "teen" | "adult";

export interface GenerateImageParams {
  positivePrompt: string;
  model?: string;
  width?: number;
  height?: number;
  numberResults?: number;
  outputFormat?: string;
  CFGScale?: number;
  scheduler?: string;
  strength?: number;
  promptWeighting?: "compel" | "sdEmbeds";
  seed?: number | null;
  lora?: string[];
  ageGroup?: AgeGroup;
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed: number;
  NSFWContent: boolean;
}

export class RunwareService {
  private ws: WebSocket | null = null;
  private apiKey: string | null = null;
  private connectionSessionUUID: string | null = null;
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  private isAuthenticated: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.connectionPromise = this.connect();
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(API_ENDPOINT);
      
      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.authenticate().then(resolve).catch(reject);
      };

      this.ws.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        const response = JSON.parse(event.data);
        
        if (response.error || response.errors) {
          console.error("WebSocket error response:", response);
          const errorMessage = response.errorMessage || response.errors?.[0]?.message || "An error occurred";
          toast.error(errorMessage);
          return;
        }

        if (response.data) {
          response.data.forEach((item: any) => {
            if (item.taskType === "authentication") {
              console.log("Authentication successful, session UUID:", item.connectionSessionUUID);
              this.connectionSessionUUID = item.connectionSessionUUID;
              this.isAuthenticated = true;
            } else {
              const callback = this.messageCallbacks.get(item.taskUUID);
              if (callback) {
                callback(item);
                this.messageCallbacks.delete(item.taskUUID);
              }
            }
          });
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast.error("Connection error. Please try again.");
        reject(error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket closed, attempting to reconnect...");
        this.isAuthenticated = false;
        setTimeout(() => {
          this.connectionPromise = this.connect();
        }, 1000);
      };
    });
  }

  private async authenticate(): Promise<void> {
    try {
      const { data: { secret } } = await supabase.functions.invoke('get-runware-key');
      this.apiKey = secret;
    } catch (error) {
      console.error('Error fetching Runware API key:', error);
      throw new Error('Failed to authenticate with Runware');
    }

    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket not ready for authentication"));
        return;
      }
      
      const authMessage = [{
        taskType: "authentication",
        apiKey: this.apiKey,
        ...(this.connectionSessionUUID && { connectionSessionUUID: this.connectionSessionUUID }),
      }];
      
      console.log("Sending authentication message");
      
      const authCallback = (event: MessageEvent) => {
        const response = JSON.parse(event.data);
        if (response.data?.[0]?.taskType === "authentication") {
          this.ws?.removeEventListener("message", authCallback);
          resolve();
        }
      };
      
      this.ws.addEventListener("message", authCallback);
      this.ws.send(JSON.stringify(authMessage));
    });
  }

  private enhancePrompt(prompt: string, ageGroup?: AgeGroup, model?: string): string {
    // Core coloring page attributes that apply to all age groups
    const coreAttributes = "black and white smooth and clean lineart, high contrast, crisp lines on white background, no grayscale, no shading, no color";
    
    // Create specific prompt templates based on age group
    let ageSpecificPrompt = "";
    
    switch(ageGroup) {
      case "toddler":
        ageSpecificPrompt = `${coreAttributes} of ${prompt}, designed with extra-large, simple shapes and thick outlines, ensuring easy coloring for toddlers aged 1-3 years`;
        break;
      case "preschool":
        ageSpecificPrompt = `${coreAttributes} of ${prompt}, featuring bold outlines, minimal intricate details, and engaging, recognizable elements, perfect for preschoolers aged 3-5 years`;
        break;
      case "school":
        ageSpecificPrompt = `${coreAttributes} of ${prompt}, with moderate details, clear and fun designs, and interactive elements, ideal for kids aged 6-12 years to enjoy coloring`;
        break;
      case "teen":
        ageSpecificPrompt = `${coreAttributes} of ${prompt}, featuring intricate patterns, detailed backgrounds, and stylish elements, catering to the artistic preferences of teens aged 13-17 years`;
        break;
      case "adult":
        ageSpecificPrompt = `${coreAttributes} of ${prompt}, designed with high-detail elements, intricate patterns, and artistic compositions, providing a relaxing and immersive coloring experience for adults aged 18+`;
        break;
      default:
        // If no age group is selected, use a general template
        ageSpecificPrompt = `${coreAttributes} of ${prompt}, with well-defined borders and easily colorable spaces`;
    }
    
    // Quality specifications for all age groups
    const qualityDetails = "professional quality, printable quality, coloring book style";
    
    // Combine all parts of the prompt
    let enhancedPrompt = `${ageSpecificPrompt}, ${qualityDetails}`;
    
    // Add model-specific enhancements
    if (model === "runware:flux-dev@1") {
      enhancedPrompt = `${enhancedPrompt}, professional line art illustration style`;
    }
    
    return enhancedPrompt.trim();
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    await this.connectionPromise;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.isAuthenticated) {
      this.connectionPromise = this.connect();
      await this.connectionPromise;
    }

    const taskUUID = crypto.randomUUID();
    const enhancedPrompt = this.enhancePrompt(params.positivePrompt, params.ageGroup, params.model);
    
    return new Promise((resolve, reject) => {
      const message = [{
        taskType: "imageInference",
        taskUUID,
        positivePrompt: enhancedPrompt,
        model: params.model || "runware:100@1",
        width: params.width || 1024,
        height: params.height || 1024,
        numberResults: params.numberResults || 1,
        outputFormat: params.outputFormat || "WEBP",
        steps: 4,
        CFGScale: params.CFGScale || 1,
        scheduler: params.scheduler || "FlowMatchEulerDiscreteScheduler",
        strength: params.strength || 0.8,
        lora: params.lora || [],
      }];

      console.log("Sending image generation message:", message);

      this.messageCallbacks.set(taskUUID, (data) => {
        if (data.error) {
          reject(new Error(data.errorMessage));
        } else {
          resolve(data);
        }
      });

      this.ws.send(JSON.stringify(message));
    });
  }
}

export const runwareService = new RunwareService();
