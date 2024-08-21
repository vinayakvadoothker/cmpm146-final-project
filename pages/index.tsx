// index.tsx

import React from 'react';
import { AdventureCarousel } from '../components/AdventureCarousel';

const Home: React.FC = () => {
    const scrollToSection = () => {
        const section = document.getElementById('overview-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground">
            <div className="flex flex-col justify-center items-center w-full p-6">
                <div className="text-center">
                    <h1>D&D Text Adventure</h1>
                    <p className="mt-4 text-lg max-w-xl mx-auto">
                        Embark on a journey of danger and adventure, where your choices shape the story.
                    </p>
                </div>

                <div className="flex flex-col justify-center items-center w-full">
                    <AdventureCarousel narrative={''} choices={[]} />

                </div>

                <div id="overview-section" className="mt-40 text-center max-w-3xl space-y-6">
                    <p>
                        This project aims to create a <strong>D&D-inspired text adventure</strong>. The player will be able to go through <strong>3 encounters</strong>: <strong>gearing up</strong>, <strong>exploring a dungeon</strong>, and <strong>beating a dragon</strong>. The <strong>LLMs</strong> will generate the narrative and control the decisions of all <strong>NPCs</strong> (non-playable characters) in the story. The user will control the <strong>main character</strong>, and the progression of the story will be determined by the user’s choices. There will also be accompanying visuals that are <strong>AI generated</strong>.
                    </p>

                    <h2 className="text-2xl font-bold">Team</h2>
                    <p>Vinayak Vadoothker, Siyao Li, Jacqueline Palevich, Leonardo Dulanto</p>

                    <h2 className="text-2xl font-bold">Theme</h2>
                    <p>D&D-Based LLM Text Adventure</p>

                    <h2 className="text-2xl font-bold">Novelty</h2>
                    <p>
                        This project leverages multiple LLMs to create a dynamic and immersive storytelling experience, allowing for complex and unpredictable narratives.
                    </p>

                    <h2 className="text-2xl font-bold">Value</h2>
                    <p>
                        Gamers and AI enthusiasts will benefit from a unique, AI-driven adventure that offers endless replayability and personalization.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;
