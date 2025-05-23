"use client";

import type { MealEntry } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2, CalendarDays, Flame } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryListProps {
  history: MealEntry[];
  onClearHistory: () => void;
  onSelectHistoryItem: (item: MealEntry) => void;
}

export function HistoryList({ history, onClearHistory, onSelectHistoryItem }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Meal History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No meals analyzed yet. Upload an image to start tracking!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Meal History</CardTitle>
        <Button variant="outline" size="sm" onClick={onClearHistory} className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/50">
          <Trash2 className="mr-2 h-4 w-4" /> Clear History
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-3">
          <div className="space-y-4">
            {history.map((entry) => (
              <Card 
                key={entry.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectHistoryItem(entry)}
              >
                <CardContent className="p-4 flex space-x-4 items-start">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden border shrink-0">
                    <Image src={entry.imageDataUrl} alt="Meal thumbnail" layout="fill" objectFit="cover" data-ai-hint="food meal" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-primary truncate" title={entry.foodItems.join(', ')}>
                      {entry.foodItems.join(', ') || 'Unknown Food'}
                    </p>
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <CalendarDays className="mr-1 h-3 w-3" />
                      {format(new Date(entry.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                    <div className="text-sm text-foreground/90 flex items-center mt-2">
                       <Flame className="mr-1 h-4 w-4 text-red-500" /> 
                       Calories: <span className="font-semibold ml-1">{Math.round(entry.nutrition.calories)} kcal</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                       Protein: {Math.round(entry.nutrition.protein)}g, Fat: {Math.round(entry.nutrition.fat)}g, Carbs: {Math.round(entry.nutrition.carbohydrates)}g
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
