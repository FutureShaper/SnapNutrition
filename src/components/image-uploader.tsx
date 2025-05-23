"use client";

import type React from 'react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File, dataUrl: string) => void;
  currentImageUrl?: string | null;
  isLoading: boolean;
}

export function ImageUploader({ onImageSelect, currentImageUrl, isLoading }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPreviewUrl(dataUrl);
        onImageSelect(file, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChooseAnotherImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
    // Potentially call a prop to clear analysis results in parent
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Upload Food Photo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-md overflow-hidden border">
              <Image src={previewUrl} alt="Food preview" layout="fill" objectFit="contain" data-ai-hint="food meal" />
            </div>
            <Button onClick={handleChooseAnotherImage} variant="outline" disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" /> Choose Another Image
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md space-y-3">
            <UploadCloud className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">Drag & drop or click to upload</p>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={isLoading}
            />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" disabled={isLoading}>
              Browse Files
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
