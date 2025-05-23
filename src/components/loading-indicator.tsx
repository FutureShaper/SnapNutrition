"use client";

import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({ message = "Analyzing your meal..." }: LoadingIndicatorProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-8 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
