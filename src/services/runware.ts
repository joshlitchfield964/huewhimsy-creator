
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
    const ageGroupPrompts = {
      toddler: "extremely simple with very thick, bold outlines, large basic shapes, minimal details, perfect for toddlers",
      preschool: "simple designs with clear thick outlines, basic recognizable shapes, limited details, easy for preschoolers to color",
      school: "moderate detail with defined outlines, engaging elements but not too complex, perfect for elementary school children",
      teen: "more intricate patterns with clear lines, interesting details and creative designs appealing to teenagers",
      adult: "sophisticated designs with detailed patterns, intricate elements, and complex arrangements suitable for adults"
    };

    // Core coloring page requirements
    const coreRequirements = "pure black and white line art for coloring books, crisp black lines on white background, high contrast";
    
    // Style specifics
    const styleDetails = "no grayscale, no shading, no color, clear separations between elements, easily colorable spaces";
    
    // Quality enhancements
    const qualityDetails = "professional quality, clean lines, well-defined borders, printable quality";

    // Build enhanced prompt
    let enhancedPrompt = `${coreRequirements}, ${prompt}, ${ageGroup ? ageGroupPrompts[ageGroup] : ""}, ${styleDetails}, ${qualityDetails}`;

    // Model-specific enhancements
    if (model === "runware:flux-dev@1") {
      enhancedPrompt = `${enhancedPrompt}, coloring book illustration style, professional line art`;
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
