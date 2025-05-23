import { Zap, Salad } from 'lucide-react';

export function SnapNutritionLogo({ size = 28, textSize = "text-2xl" }: { size?: number; textSize?: string; }) {
  return (
    <div className="flex items-center space-x-2">
      <Zap className="text-primary" size={size} strokeWidth={2.5} />
      <Salad className="text-accent" size={size} strokeWidth={2.5} />
      <span className={`font-bold ${textSize} text-primary tracking-tight`}>SnapNutrition</span>
    </div>
  );
}
