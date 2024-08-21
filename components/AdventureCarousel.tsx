import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

interface Choice {
  id: string;
  text: string;
}

interface AdventureCarouselProps {
  narrative: string;
  choices: Choice[];
}

export function AdventureCarousel({ narrative, choices }: AdventureCarouselProps) {
  const [currentNarrative, setCurrentNarrative] = useState<string>(narrative);
  const [currentChoices, setCurrentChoices] = useState<Choice[]>(choices);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    const savedStep = localStorage.getItem('adventure-step');
    const savedNarrative = localStorage.getItem('adventure-narrative');
    const savedImageUrl = localStorage.getItem('adventure-image-url');
    const savedChoices = localStorage.getItem('adventure-choices');

    if (savedStep && savedNarrative && savedImageUrl && savedChoices) {
      setStep(parseInt(savedStep));
      setCurrentNarrative(savedNarrative);
      setImageUrl(savedImageUrl);
      setCurrentChoices(JSON.parse(savedChoices));
      setIsLoading(false);
    } else {
      fetchStory();
    }
  }, []);

  const fetchStory = async () => {
    setIsLoading(true);
    const response = await fetch('/api/generateStory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: '', isFirstVisit: true, step }),
    });

    const data = await response.json();
    if (data.narrative) {
      setCurrentNarrative(data.narrative);
      localStorage.setItem('adventure-narrative', data.narrative);
      await fetchImage(data.narrative); // Fetch the image based on the narrative
    }
    if (data.choices) {
      setCurrentChoices(data.choices);
      localStorage.setItem('adventure-choices', JSON.stringify(data.choices));
    }
    if (data.step) {
      setStep(data.step);
      localStorage.setItem('adventure-step', data.step.toString());
    }
    setIsLoading(false);
  };

  const fetchImage = async (narrativeText: string) => {
    try {
      const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ narrative: narrativeText }),
      });
      const data = await response.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        localStorage.setItem('adventure-image-url', data.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const handleChoiceClick = async (choiceId: string) => {
    setIsButtonLoading(true);
    const response = await fetch('/api/generateStory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: choiceId, isFirstVisit: false, step }),
    });

    const data = await response.json();
    if (data.narrative) {
      setCurrentNarrative(data.narrative);
      localStorage.setItem('adventure-narrative', data.narrative);
      await fetchImage(data.narrative); // Fetch the image for the new narrative
    }
    if (data.choices) {
      setCurrentChoices(data.choices);
      localStorage.setItem('adventure-choices', JSON.stringify(data.choices));
    }
    if (data.step) {
      setStep(data.step);
      localStorage.setItem('adventure-step', data.step.toString());
    }
    setIsButtonLoading(false);
  };

  return (
    <div className="w-[80%] md:w-[80%] mx-auto mt-4">
      <Card>
        <CardHeader>
          <CardTitle>The Adventure</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading || isButtonLoading ? (
            <div className="flex justify-center items-center text-lg font-semibold">
              Loading...
            </div>
          ) : (
            <>
              {imageUrl && (
                <div className="flex justify-center items-center w-full mb-4">  {/* Centering the image */}
                  <div className="relative w-80 h-80">  {/* Image wrapper */}
                    <Image
                      src={imageUrl}
                      alt="Generated Scene"
                      layout="fill"  // Ensures the image fills the container
                      objectFit="contain"  // Adjusts how the image is displayed within the container
                    />
                  </div>
                </div>
              )}
              <div className="text-lg font-semibold text-center mb-4">{currentNarrative}</div>
              <div className="flex flex-col md:flex-row justify-between md:space-x-4 space-y-2 md:space-y-0">
                {currentChoices.map((choice) => {
                  const choiceText = choice.id.replace(/\{\{[0-9]+\.\}\}\s*/, '').trim();
                  const [buttonText, description] = choiceText.split(':').map(part => part.trim());

                  return (
                    <Button
                      key={choice.id}
                      onClick={() => handleChoiceClick(choice.id)}
                      className="flex-1 flex flex-col items-center justify-center"
                      disabled={isButtonLoading}
                    >
                      {isButtonLoading ? (
                        <span className="text-base font-semibold">Processing...</span>
                      ) : (
                        <>
                          <span className="text-base font-semibold">{buttonText}</span>
                          {description && <span className="text-xs text-gray-500 mt-1">{description}</span>}
                        </>
                      )}
                    </Button>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
