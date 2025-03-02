
import { UserGenerationStats } from "../generation/types";

export interface UserGenerationService {
  checkFreeGenerationAvailability(): Promise<boolean>;
  recordGeneration(): Promise<void>;
  getUserGenerationStats(): Promise<UserGenerationStats | null>;
}
