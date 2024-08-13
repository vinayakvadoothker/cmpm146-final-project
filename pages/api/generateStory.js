import { OpenAI } from 'openai';
const openai = new OpenAI(process.env.OPENAI_API_KEY);

export default async function generateStory(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { userInput, currentStep, story } = req.body;

  const messages = [
    ...story.map((s) => ({ role: 'assistant', content: s.text })),
    { role: 'user', content: userInput },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages,
    });

    const generatedText = response.choices[0].message.content;

    const updatedStory = [...story, { step: currentStep, text: generatedText }];

    res.status(200).json({ story: updatedStory });
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
}
