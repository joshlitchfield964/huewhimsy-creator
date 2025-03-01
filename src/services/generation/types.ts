
export interface UserGenerationStats {
  count: number;
  lastGeneratedAt: string | null;
  remainingToday: number;
  freeGenerationAvailable: boolean;
  isPaidUser: boolean;
  monthlyLimit: number | null;
  remainingMonthly: number | null;
}
