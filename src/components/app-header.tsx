import { SnapNutritionLogo } from '@/components/snap-nutrition-logo';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <SnapNutritionLogo />
      </div>
    </header>
  );
}
