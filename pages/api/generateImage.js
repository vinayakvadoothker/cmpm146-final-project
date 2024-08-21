// /pages/api/generateImage.js

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { narrative } = req.body;

  if (!narrative) {
    return res.status(400).json({ error: 'Narrative is required' });
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create an image based on this description for a Dungeon and Dragons text adventure game: ${narrative}. Do not include any text or anything other than imagery in the image. The image should always include a mysterious character with long dark hair wearing a brown robe, with his face partially obscured by shadows. This is our main character.`,
      size: "1024x1024",  
      quality: "standard",
      n: 1,
    });

    const imageUrl = response.data[0].url;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
}
