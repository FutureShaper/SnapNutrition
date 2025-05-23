"use client";

import type { EstimateNutritionalContentOutput } from '@/ai/flows/estimate-nutritional-content';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Flame, Beef, Droplets, Wheat, ListTree } from 'lucide-react';

interface NutritionDisplayProps {
  identifiedItems: string[] | null;
  nutritionInfo: EstimateNutritionalContentOutput | null;
}

const NutrientItem: React.FC<{ icon: React.ElementType; label: string; value: string | number; unit: string; colorClass: string }> = ({ icon: Icon, label, value, unit, colorClass }) => (
  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
    <div className="flex items-center space-x-3">
      <Icon className={`w-6 h-6 ${colorClass}`} />
      <span className="font-medium text-foreground/90">{label}</span>
    </div>
    <span className="font-semibold text-lg text-foreground">{value} <span className="text-sm text-muted-foreground">{unit}</span></span>
  </div>
);

export function NutritionDisplay({ identifiedItems, nutritionInfo }: NutritionDisplayProps) {
  if (!nutritionInfo) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Nutritional Analysis</CardTitle>
        {identifiedItems && identifiedItems.length > 0 && (
          <CardDescription>
            Identified: <span className="font-semibold">{identifiedItems.join(', ')}</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NutrientItem icon={Flame} label="Calories" value={Math.round(nutritionInfo.calories)} unit="kcal" colorClass="text-red-500" />
          <NutrientItem icon={Beef} label="Protein" value={Math.round(nutritionInfo.protein)} unit="g" colorClass="text-blue-500" />
          <NutrientItem icon={Droplets} label="Fat" value={Math.round(nutritionInfo.fat)} unit="g" colorClass="text-yellow-500" />
          <NutrientItem icon={Wheat} label="Carbs" value={Math.round(nutritionInfo.carbohydrates)} unit="g" colorClass="text-green-500" />
        </div>
        
        <Card className="bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ListTree className="mr-2 h-5 w-5 text-primary" />
              Analysis Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {nutritionInfo.analysis}
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
