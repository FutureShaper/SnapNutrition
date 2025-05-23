import type { EstimateNutritionalContentOutput } from '@/ai/flows/estimate-nutritional-content';

export interface MealEntry {
  id: string;
  timestamp: number;
  imageDataUrl: string; // For displaying thumbnail in history
  foodItems: string[];
  nutrition: EstimateNutritionalContentOutput;
}
