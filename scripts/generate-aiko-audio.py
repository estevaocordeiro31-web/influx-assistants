#!/usr/bin/env python3
"""
Generate TTS audio for Aiko's Sydney Tour using ElevenLabs API
Voice: Jessica (Australian English)
"""

import requests
import os
import time

ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")
VOICE_ID = "cgSgspJ2msm6clMCkdW9"  # Jessica - Australian English

OUTPUT_DIR = "/home/ubuntu/influx-assistants/client/public/videos/aiko-sydney/audio"

# Script for each scene
SCENES = [
    {
        "id": "scene_01",
        "text": "Crikey! Look at the Opera House! It's even more beautiful than in the photos! I can't believe I'm finally here in Sydney!"
    },
    {
        "id": "scene_02",
        "text": "G'day mate? Fair dinkum? What does that even mean? I thought I spoke English, but Australian slang is a whole different language!"
    },
    {
        "id": "scene_03",
        "text": "This ferry ride is absolutely gorgeous! The Harbour Bridge looks massive from here. I could get used to this view every day!"
    },
    {
        "id": "scene_04",
        "text": "Vegemite?! Oh my goodness, that's... that's really something! How do Aussies eat this for breakfast? It's so salty!"
    },
    {
        "id": "scene_05",
        "text": "Oh wow, a real kangaroo! And there's a little joey in her pouch! This is the cutest thing I've ever seen! Hold still, I need a photo!"
    },
    {
        "id": "scene_06",
        "text": "Well Sydney, you've been absolutely amazing! I'll miss the beaches, the wildlife, and yes, even the Vegemite. See ya later, mate!"
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
    
    print("🎙️ Generating Aiko's Sydney Tour audio...")
    print(f"Voice: Jessica (Australian English)")
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
