import { OpenAI } from 'openai';

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userInput, isFirstVisit } = req.body;
    let step = parseInt(req.body.step) || 1;

    // Log request details
    console.log('Received request:', { userInput, isFirstVisit, step });

    try {
      let narrativeText;
      let choicesText;
      let phase = '';

      if (step === 10) {
        // Final step narrative with concluding prompt
        phase = 'concluding the adventure';

        const finalNarrativeCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini-2024-07-18',
          messages: [
            { 
              role: 'system', 
              content: `You are the Dungeon Master in a text-based adventure Dungeons & Dragons game. The player is currently in the final phase, ${phase}. Generate a concluding narrative that wraps up the adventure and provides a satisfying ending. Example: "As you deliver the final blow to the dragon, it collapses with a deafening roar. The dungeon's walls seem to breathe a sigh of relief, and a hidden door opens, revealing a treasure trove beyond your wildest dreams. You have completed your quest, and the villagers will sing of your deeds for generations."` 
            },
            { role: 'user', content: userInput },
          ],
        });

        narrativeText = finalNarrativeCompletion.choices[0].message.content;

        // Final choice: Restart the game
        choicesText = "{{1.}} Restart the Adventure: Begin your journey again from the start.";
        step = 0; // Reset the step counter for restarting
      } else if (isFirstVisit) {
        // Phase 1: Gearing up
        phase = 'gearing up';
        
        // Generate the initial narrative for a new player
        const initialNarrativeCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini-2024-07-18',
          messages: [
            { role: 'system', content: `You are the Dungeon Master in a text-based adventure Dungeons & Dragons game. The player is starting their journey and is currently in the ${phase} phase. Generate a welcoming narrative of exactly two sentences for the beginning of their adventure, including a description of the environment and initial choices. Ensure the narrative is engaging and sets the stage for the player's journey. Example: "As you step into the bustling market of Eldergrove, the aroma of fresh bread mingles with the sounds of lively chatter. Before you, a grand bazaar offers various wares and colorful stalls, and a path leads deeper into the enchanted forest."` },
            { role: 'user', content: 'Generate an initial narrative of exactly two sentences for a new player starting their adventure in a fantasy village.' },
          ],
        });

        narrativeText = initialNarrativeCompletion.choices[0].message.content;

        // Generate initial choices for the first-time visit
        const initialChoicesCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini-2024-07-18',
          messages: [
            {
              role: 'system',
              content: `You are the Dungeon Master in a text-based adventure Dungeons & Dragons game. Generate a list of initial choices that the player can choose from. Each choice should be numbered starting from {{1.}} and formatted as {{1.}}, {{2.}}, etc.
              
              Limit to 3 choices. Each choice is a maximum of 10 words.

              Example:
              {{1.}} Visit the Blacksmith: Gear up with weapons and armor.
              {{2.}} Explore the Marketplace: Discover various goods and interact with local traders.
              {{3.}} Enter the Tavern: Meet other adventurers and gather information.
              
              Ensure that the choices are engaging and align with the narrative provided.`,
            },
            {
              role: 'user',
              content: 'Generate initial choices for a new player starting their adventure in a fantasy village based on the following narrative: ' + narrativeText,
            },
          ],
        });

        choicesText = initialChoicesCompletion.choices[0].message.content;
      } else {
        // Determine the phase based on the step
        if (step < 4) {
          phase = 'gearing up';
        } else if (step < 7) {
          phase = 'exploring a dungeon';
        } else if (step < 10) {
          phase = 'beating a dragon';
        }

        // Generate the narrative based on user input for subsequent interactions
        const narrativeCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini-2024-07-18',
          messages: [
            { 
              role: 'system', 
              content: `You are the Dungeon Master in a text-based adventure Dungeons & Dragons game. The player is currently in the ${phase} phase. Based on the user's input, generate a continuation of the story. Provide a narrative that evolves from the previous interactions. Example: "The forest path you have taken leads to a mysterious cave entrance. The sound of dripping water echoes around you, and the air is thick with anticipation." Do not give any choices.` 
            },
            { role: 'user', content: userInput },
          ],
        });

        narrativeText = narrativeCompletion.choices[0].message.content;

        // Generate choices based on the updated narrative
        const choicesCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini-2024-07-18',
          messages: [
            {
              role: 'system',
              content: `You are the Dungeon Master in a text-based adventure Dungeons & Dragons game. Generate a list of choices that the player can choose from based on the following narrative. Each choice should be numbered starting from {{1.}} and formatted as {{1.}}, {{2.}}, etc.
                        
              Limit to 3 choices. Each choice is a maximum of 10 words.

              Example:
              {{1.}} Investigate the mysterious cave entrance: Venture inside to discover what secrets it holds.
              {{2.}} Return to the village: Gather more supplies before continuing your journey.
              {{3.}} Follow the river: Explore where the flowing water leads.`,
            },
            {
              role: 'user',
              content: 'Generate a list of choices based on the updated narrative: ' + narrativeText,
            },
          ],
        });

        choicesText = choicesCompletion.choices[0].message.content;
      }

      // Increment step count for next interaction
      step++;

      // Return narrative and choices as response
      res.status(200).json({
        narrative: narrativeText,
        choices: choicesText.split('\n').map(choice => {
          const [id, text] = choice.split(':');
          return { id: id.trim(), text: text?.trim() || '' };
        }),
        step,
      });
    } catch (error) {
      console.error('Error generating story:', error);
      res.status(500).json({ error: 'Error generating story' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
