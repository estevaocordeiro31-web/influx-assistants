#!/usr/bin/env python3
"""
Generate TTS audio for Lucas and the Loch Ness using ElevenLabs API
Voice: Charlie (American English - Young Male)
"""

import requests
import os
import time

ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")
VOICE_ID = "IKne3meq5aSn9XLyUdCD"  # Charlie - American English Young Male

OUTPUT_DIR = "/home/ubuntu/influx-assistants/client/public/videos/lucas-lochness/audio"

# Script for each scene
SCENES = [
    {
        "id": "scene01",
        "text": "Wow, Scotland is so cool! Look at those mountains and that huge lake! They call it Loch Ness. I wonder if the monster is real!"
    },
    {
        "id": "scene02",
        "text": "Wait, what did that guy just say? I couldn't understand a single word! Scottish accent is really hard to follow. I need to listen more carefully!"
    },
    {
        "id": "scene03",
        "text": "This hotel is awesome! It's like a real castle! I can see the whole lake from my window. Maybe I'll spot Nessie tonight!"
    },
    {
        "id": "scene04",
        "text": "Whoa! Is that... is that the Loch Ness Monster?! It's huge! And it's looking right at me! This is the coolest thing ever!"
    },
    {
        "id": "scene05",
        "text": "Oh man, it was just a dream! But it felt so real! I could have sworn I saw Nessie. Maybe next time I'll catch her for real!"
    },
    {
        "id": "scene06",
        "text": "Goodbye Loch Ness! Goodbye Nessie! I'll never forget this trip. Scotland, you're amazing! I'll definitely come back someday!"
    }
]

def generate_audio(text, output_path):
    """Generate audio using ElevenLabs API"""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }
    
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 200:
        with open(output_path, "wb") as f:
            f.write(response.content)
        print(f"✅ Audio saved: {output_path}")
        return True
    else:
        print(f"❌ Error generating {output_path}: {response.status_code}")
        print(response.text)
        return False

def main():
    if not ELEVENLABS_API_KEY:
        print("❌ ELEVENLABS_API_KEY not found in environment")
        return
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("🎙️ Generating Lucas and the Loch Ness audio...")
    print(f"Voice: Charlie (American English)")
    print("-" * 50)
    
    for scene in SCENES:
        output_path = os.path.join(OUTPUT_DIR, f"{scene['id']}.mp3")
        print(f"\n📝 Scene: {scene['id']}")
        print(f"   Text: {scene['text'][:50]}...")
        
        if generate_audio(scene['text'], output_path):
            time.sleep(1)  # Rate limiting
    
    print("\n" + "=" * 50)
    print("✅ All audio files generated!")
    print(f"📁 Output directory: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
