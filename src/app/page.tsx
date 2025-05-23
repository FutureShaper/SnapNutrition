"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { ImageUploader } from '@/components/image-uploader';
import { NutritionDisplay } from '@/components/nutrition-display';
import { HistoryList } from '@/components/history-list';
import { LoadingIndicator } from '@/components/loading-indicator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { identifyFoodFromImage, type IdentifyFoodFromImageOutput } from '@/ai/flows/identify-food-from-image';
import { estimateNutritionalContent, type EstimateNutritionalContentOutput } from '@/ai/flows/estimate-nutritional-content';
import { getHistory, addMealToHistory, clearHistoryStorage } from '@/lib/history-storage';
import type { MealEntry } from '@/types';
import { Zap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const [selectedImageDataUrl, setSelectedImageDataUrl] = useState<string | null>(null);
  const [identifiedFoodItems, setIdentifiedFoodItems] = useState<string[] | null>(null);
  const [nutritionalInfo, setNutritionalInfo] = useState<EstimateNutritionalContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<MealEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleImageSelect = (file: File, dataUrl: string) => {
    setSelectedImageDataUrl(dataUrl);
    setIdentifiedFoodItems(null);
    setNutritionalInfo(null);
  };

  const handleAnalyzeFood = async () => {
    if (!selectedImageDataUrl) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image of your meal first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setIdentifiedFoodItems(null);
    setNutritionalInfo(null);

    try {
      // Step 1: Identify food from image
      const identificationResult: IdentifyFoodFromImageOutput = await identifyFoodFromImage({ photoDataUri: selectedImageDataUrl });
      
      if (!identificationResult.foodItems || identificationResult.foodItems.length === 0) {
        toast({
          title: "Food Identification Failed",
          description: "Could not identify any food items in the image. Please try a clearer image.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      setIdentifiedFoodItems(identificationResult.foodItems);

      // Step 2: Estimate nutritional content
      const foodDescription = identificationResult.foodItems.join(', ');
      const nutritionResult: EstimateNutritionalContentOutput = await estimateNutritionalContent({ foodItemsDescription: foodDescription });
      setNutritionalInfo(nutritionResult);

      // Step 3: Add to history
      const newMealEntry: MealEntry = {
        id: new Date().toISOString() + Math.random().toString(36).substring(2,9), // Simple unique ID
        timestamp: Date.now(),
        imageDataUrl: selectedImageDataUrl,
        foodItems: identificationResult.foodItems,
        nutrition: nutritionResult,
      };
      const updatedHistory = addMealToHistory(newMealEntry);
      setHistory(updatedHistory);

      toast({
        title: "Analysis Complete!",
        description: "Nutritional information has been estimated.",
      });

    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Error",
        description: "An error occurred during the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    clearHistoryStorage();
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "Your meal history has been cleared.",
    });
  };
  
  const handleSelectHistoryItem = (item: MealEntry) => {
    setSelectedImageDataUrl(item.imageDataUrl);
    setIdentifiedFoodItems(item.foodItems);
    setNutritionalInfo(item.nutrition);
    window.scrollTo({ top: 0, behavior: 'smooth' });
     toast({
      title: "Loaded from History",
      description: `Displaying details for: ${item.foodItems.join(', ')}`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Upload and Analysis */}
          <div className="lg:col-span-2 space-y-8">
            <ImageUploader 
              onImageSelect={handleImageSelect} 
              currentImageUrl={selectedImageDataUrl}
              isLoading={isLoading}
            />

            {selectedImageDataUrl && (
              <Button 
                onClick={handleAnalyzeFood} 
                disabled={isLoading || !selectedImageDataUrl} 
                className="w-full py-6 text-lg bg-accent hover:bg-accent/90 text-accent-foreground"
                size="lg"
              >
                <Zap className="mr-2 h-5 w-5" />
                {isLoading ? 'Analyzing...' : 'Analyze Meal'}
              </Button>
            )}

            {isLoading && <LoadingIndicator />}
            
            {!isLoading && nutritionalInfo && (
              <NutritionDisplay 
                identifiedItems={identifiedFoodItems} 
                nutritionInfo={nutritionalInfo} 
              />
            )}
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-1 space-y-8">
            <HistoryList 
              history={history} 
              onClearHistory={handleClearHistory}
              onSelectHistoryItem={handleSelectHistoryItem}
            />
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm">
        <Separator className="mb-4" />
        Powered by GenAI & Next.js &copy; {new Date().getFullYear()} SnapNutrition
      </footer>
    </div>
  );
}
