
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GenerateImageParams, GeneratedImage } from "./types";
import { enhancePrompt } from "./promptUtils";
import { 
  API_ENDPOINT, 
  DEFAULT_MODEL,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_OUTPUT_FORMAT,
  DEFAULT_CFG_SCALE,
  DEFAULT_SCHEDULER,
  DEFAULT_STRENGTH,
  DEFAULT_NUMBER_RESULTS,
  DEFAULT_STEPS
} from "./config";

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

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    await this.connectionPromise;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.isAuthenticated) {
      this.connectionPromise = this.connect();
      await this.connectionPromise;
    }

    const taskUUID = crypto.randomUUID();
    const enhancedPrompt = enhancePrompt(params.positivePrompt, params.ageGroup, params.model);
    
    return new Promise((resolve, reject) => {
      const message = [{
        taskType: "imageInference",
        taskUUID,
        positivePrompt: enhancedPrompt,
        model: params.model || DEFAULT_MODEL,
        width: params.width || DEFAULT_WIDTH,
        height: params.height || DEFAULT_HEIGHT,
        numberResults: params.numberResults || DEFAULT_NUMBER_RESULTS,
        outputFormat: params.outputFormat || DEFAULT_OUTPUT_FORMAT,
        steps: DEFAULT_STEPS,
        CFGScale: params.CFGScale || DEFAULT_CFG_SCALE,
        scheduler: params.scheduler || DEFAULT_SCHEDULER,
        strength: params.strength || DEFAULT_STRENGTH,
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
