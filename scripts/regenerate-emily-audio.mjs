/**
 * Regenerate Emily's "Eating Out" video audio with correct British accent
 * Uses Charlotte voice from ElevenLabs (XB0fDUnXU5powFXDhCwa)
 */

import fs from 'fs';
import path from 'path';

// Load env
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const CHARLOTTE_VOICE_ID = "XB0fDUnXU5powFXDhCwa"; // Charlotte - British female

if (!ELEVENLABS_API_KEY) {
  console.error("ERROR: ELEVENLABS_API_KEY not found in environment");
  process.exit(1);
}

// Emily's dialogue for Eating Out (Unit 2) - the full script
const EMILY_DIALOGUE = [
  "Right, so I walked into this American diner and the waiter immediately goes 'Hi! How are you today?' with the biggest smile ever!",
  "The menu was absolutely massive! In England, we have like three options. Here? There's a whole novel of food choices!",
  "When the food arrived, it could feed a small village! Americans don't do portions, they do mountains!",
  "And then... the tip! In England, it's optional. Here, it's basically mandatory! I had to do maths after eating. Cruel!",
];

// Combine all dialogue into one continuous narration with pauses
const fullDialogue = EMILY_DIALOGUE.join(" ... ");

async function generateAudioWithElevenLabs(text, voiceId) {
  console.log(`Generating audio with Charlotte (British) voice...`);
  console.log(`Text: ${text.substring(0, 80)}...`);
  console.log(`Voice ID: ${voiceId}`);
  
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.7,        // More stable for British RP
          similarity_boost: 0.75,
          style: 0.3,            // Slight style for expressiveness
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main() {
  console.log("=".repeat(60));
  console.log("Regenerating Emily's Eating Out Audio - British Accent");
  console.log("Voice: Charlotte (XB0fDUnXU5powFXDhCwa)");
  console.log("=".repeat(60));

  try {
    // Generate audio for each scene separately for better timing
    const audioBuffers = [];
    
    for (let i = 0; i < EMILY_DIALOGUE.length; i++) {
      console.log(`\nScene ${i + 1}/${EMILY_DIALOGUE.length}:`);
      const buffer = await generateAudioWithElevenLabs(EMILY_DIALOGUE[i], CHARLOTTE_VOICE_ID);
      
      const scenePath = `/home/ubuntu/emily_eating_out_scene${i + 1}.mp3`;
      fs.writeFileSync(scenePath, buffer);
      console.log(`  Saved: ${scenePath} (${buffer.length} bytes)`);
      audioBuffers.push(scenePath);
      
      // Small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Also generate the full narration as one piece
    console.log("\nGenerating full narration...");
    const fullBuffer = await generateAudioWithElevenLabs(fullDialogue, CHARLOTTE_VOICE_ID);
    const fullPath = "/home/ubuntu/emily_eating_out_full_british.mp3";
    fs.writeFileSync(fullPath, fullBuffer);
    console.log(`Saved full narration: ${fullPath} (${fullBuffer.length} bytes)`);

    console.log("\n" + "=".repeat(60));
    console.log("SUCCESS! All audio files generated with British accent.");
    console.log("Scene files:");
    audioBuffers.forEach((p, i) => console.log(`  Scene ${i + 1}: ${p}`));
    console.log(`Full narration: ${fullPath}`);
    console.log("=".repeat(60));
    
  } catch (error) {
    console.error("ERROR:", error.message);
    process.exit(1);
  }
}

main();
