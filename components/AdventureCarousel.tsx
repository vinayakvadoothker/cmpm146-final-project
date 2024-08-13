import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const AdventureCarousel: React.FC = () => {
  const [story, setStory] = useState<{ step: number; text: string }[]>([
    { step: 0, text: "Welcome to the adventure" }
  ]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleUserInput = async (userInput: string) => {
    const updatedStory = await fetch('/api/generateStory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput, currentStep, story }),
    }).then((res) => res.json());

    setStory(updatedStory.story);
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {story.map((item, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{item.text}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default AdventureCarousel;
