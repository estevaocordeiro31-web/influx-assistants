/**
 * Regenerate ALL VP2 video audio with correct ElevenLabs voices
 * 
 * Lucas (Units 1, 4, 7): Adam (pNInz6obpgDQGcFmaJgB) - American English
 * Emily (Units 2, 5, 8): Charlotte (XB0fDUnXU5powFXDhCwa) - British English  
 * Aiko (Units 3, 6): Jessica (cgSgspJ2msm6clMCkdW9) - Australian English
 */

import fs from 'fs';
import path from 'path';

// Load env
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
if (!ELEVENLABS_API_KEY) { console.error("ERROR: ELEVENLABS_API_KEY not found"); process.exit(1); }

const OUTPUT_DIR = "/home/ubuntu/vp2_audit/corrected";
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Voice configuration
const VOICES = {
  lucas: { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", accent: "American", stability: 0.5, similarity: 0.75 },
  emily: { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte", accent: "British", stability: 0.7, similarity: 0.75 },
  aiko:  { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica", accent: "Australian", stability: 0.5, similarity: 0.75 },
};

// All 8 units with their dialogues
const UNITS = [
  {
    unit: 1, character: "lucas", title: "Lucas at the Airport",
    dialogues: [
      "Alright, so I'm at JFK, ready for my vacation! This is gonna be awesome!",
      "The lady at check-in goes 'Sir, your bag is overweight.' I'm like, it's just souvenirs! Okay, maybe too many souvenirs.",
      "Then I heard 'Last call for flight 247!' I ran so fast, I think I broke a world record!",
      "Made it! Pro tip: always check your gate number twice! Trust me on this one.",
    ]
  },
  {
    unit: 2, character: "emily", title: "Emily's Restaurant Adventure",
    skip: true, // Already fixed
    dialogues: []
  },
  {
    unit: 3, character: "aiko", title: "Aiko Explores Sydney",
    dialogues: [
      "G'day! I decided to explore Sydney CBD today! The weather's absolutely gorgeous!",
      "I asked a bloke where the Opera House was. He goes 'Just follow the harbour, love!' So friendly!",
      "When I saw the Opera House, I was gobsmacked! It's even more stunning in person!",
      "I took a ferry to Manly Beach. Best way to see the harbour, no worries!",
    ]
  },
  {
    unit: 4, character: "lucas", title: "Lucas Describes His Squad",
    dialogues: [
      "Yo, let me tell you about my squad! These guys are the best!",
      "Jake's got curly hair and he always wears his lucky Knicks jersey. Dude's obsessed!",
      "Maria's got long dark hair and a huge personality! She's the life of the party!",
      "That's my crew! Variety is the spice of life, am I right?",
    ]
  },
  {
    unit: 5, character: "emily", title: "Emily Goes Shopping",
    dialogues: [
      "Right, so I went to Oxford Street for some retail therapy! A girl's got to treat herself!",
      "'Can I help you?' 'Just browsing, thanks!' That's the British way, isn't it?",
      "The fitting room had the worst lighting ever! Nobody looks good under fluorescent lights!",
      "British coins are confusing! We've got like seven different ones! Make it make sense!",
    ]
  },
  {
    unit: 6, character: "aiko", title: "Aiko's Life Advice",
    dialogues: [
      "My mate asked me for advice about moving to Australia. Where do I even start?",
      "We've got spiders the size of your hand. No biggie! You get used to them, honestly!",
      "If I were you, I'd always wear sunscreen! The Australian sun is no joke, trust me!",
      "Always swim between the flags! She'll be right, mate! That's the Aussie way!",
    ]
  },
  {
    unit: 7, character: "lucas", title: "Lucas and His Hobbies",
    dialogues: [
      "People always ask 'What do you do in your free time?' Well, buckle up!",
      "I'm really into gaming. My mom says I'm addicted! I say I'm dedicated. There's a difference!",
      "I'm also into skateboarding. I've been skating for like three years now. Still can't do a kickflip though. Work in progress!",
      "Sometimes I just chill and watch Netflix. That counts as a hobby, right? Self-care is important!",
    ]
  },
  {
    unit: 8, character: "emily", title: "Emily's Future Plans",
    dialogues: [
      "Right, so I'm on the London Eye thinking about the future. Very philosophical, I know. Bear with me!",
      "Everyone keeps asking 'What are you going to do after uni?' I'm going to travel! I'm planning to visit at least thirty countries before I'm thirty!",
      "For now, I'm going to finish my degree. Then I'm going to take a gap year. My parents aren't thrilled, but hey!",
      "The future is scary but exciting! As we Brits say, 'Keep calm and carry on!' And maybe pack an umbrella. Always.",
    ]
  },
];

async function generateAudio(text, voiceConfig) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.id}`,
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
          stability: voiceConfig.stability,
          similarity_boost: voiceConfig.similarity,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  console.log("=".repeat(60));
  console.log("Regenerating ALL VP2 Audio with Correct Accents");
  console.log("=".repeat(60));
  console.log("");
  console.log("Lucas (Units 1,4,7): Adam - American English");
  console.log("Emily (Units 2,5,8): Charlotte - British English");
  console.log("Aiko  (Units 3,6):   Jessica - Australian English");
  console.log("=".repeat(60));

  const results = [];

  for (const unit of UNITS) {
    if (unit.skip) {
      console.log(`\n⏭️  Unit ${unit.unit}: ${unit.title} - SKIPPED (already fixed)`);
      results.push({ unit: unit.unit, status: "skipped" });
      continue;
    }

    const voice = VOICES[unit.character];
    console.log(`\n🎤 Unit ${unit.unit}: ${unit.title}`);
    console.log(`   Character: ${unit.character} | Voice: ${voice.name} (${voice.accent})`);

    try {
      // Generate full narration (all dialogues combined with pauses)
      const fullText = unit.dialogues.join(" ... ");
      console.log(`   Generating full narration (${fullText.length} chars)...`);
      
      const audioBuffer = await generateAudio(fullText, voice);
      const outputPath = `${OUTPUT_DIR}/unit${String(unit.unit).padStart(2, '0')}_${unit.character}_full.mp3`;
      fs.writeFileSync(outputPath, audioBuffer);
      
      console.log(`   ✅ Saved: ${outputPath} (${(audioBuffer.length / 1024).toFixed(1)} KB)`);
      results.push({ unit: unit.unit, status: "success", path: outputPath, size: audioBuffer.length });

      // Wait between API calls to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`   ❌ ERROR: ${error.message}`);
      results.push({ unit: unit.unit, status: "error", error: error.message });
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("RESULTS:");
  console.log("=".repeat(60));
  
  for (const r of results) {
    const icon = r.status === "success" ? "✅" : r.status === "skipped" ? "⏭️" : "❌";
    console.log(`  ${icon} Unit ${r.unit}: ${r.status}${r.path ? ` → ${r.path}` : ""}`);
  }
  
  const successCount = results.filter(r => r.status === "success").length;
  const skipCount = results.filter(r => r.status === "skipped").length;
  console.log(`\nTotal: ${successCount} generated, ${skipCount} skipped, ${results.length - successCount - skipCount} errors`);
}

main();
