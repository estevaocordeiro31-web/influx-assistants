#!/usr/bin/env python3
"""
Generate TTS audio for Emily's Texas Adventure using ElevenLabs API
Emily uses Charlotte voice (British accent)
"""

import os
import requests
import time

# ElevenLabs API configuration
ELEVENLABS_API_KEY = os.environ.get('ELEVENLABS_API_KEY', '')
CHARLOTTE_VOICE_ID = "XB0fDUnXU5powFXDhCwa"  # Charlotte - British accent

# Output directory
OUTPUT_DIR = "/home/ubuntu/influx-assistants/client/public/videos/emily-texas/audio"

# Emily's dialogues from the script
DIALOGUES = [
    {
        "id": 1,
        "text": "Right, so I went to Texas, and everything is absolutely massive! The steaks, the trucks, the hats..."
    },
    {
        "id": 2,
        "text": "I asked for a 'small' portion and they brought me enough food to feed my entire street back in London!"
    },
    {
        "id": 3,
        "text": "And when I said 'lovely weather, isn't it?', the bloke looked at me like I was speaking Martian!"
    },
    {
        "id": 4,
        "text": "He goes 'Y'all ain't from around here, are ya?' I'm like, what gave it away? The accent or the umbrella?"
    },
    {
        "id": 5,
        "text": "They took me to a rodeo. Brilliant! In England, the most exciting animal event is watching the Queen's corgis!"
    },
    {
        "id": 6,
        "text": "Anyway, Texas was proper mental! But I do miss a good cuppa. Their tea is... well, it's iced. Iced! The audacity!"
    }
]

def generate_audio(text, output_path, voice_id=CHARLOTTE_VOICE_ID):
    """Generate audio using ElevenLabs API"""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    
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
            "similarity_boost": 0.75,
            "style": 0.3,
            "use_speaker_boost": True
        }
    }
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = requests.post(url, json=data, headers=headers, timeout=60)
            
            if response.status_code == 200:
                with open(output_path, 'wb') as f:
                    f.write(response.content)
                return True
            elif response.status_code == 429:
                # Rate limited, wait and retry
                wait_time = (attempt + 1) * 10
                print(f"  Rate limited, waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"  Error: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"  Exception: {e}")
            time.sleep(5)
    
    return False

def main():
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("=" * 50)
    print("Generating Emily's Texas Adventure Audio")
    print("Voice: Charlotte (British accent)")
    print("=" * 50)
    
    for dialogue in DIALOGUES:
        scene_id = dialogue["id"]
        text = dialogue["text"]
        output_path = os.path.join(OUTPUT_DIR, f"scene_{scene_id:02d}.mp3")
        
        print(f"\nScene {scene_id}: {text[:50]}...")
        
        if os.path.exists(output_path):
            print(f"  Already exists, skipping...")
            continue
        
        success = generate_audio(text, output_path)
        
        if success:
            print(f"  ✓ Generated: {output_path}")
        else:
            print(f"  ✗ Failed to generate audio")
        
        # Small delay between requests
        time.sleep(2)
    
    print("\n" + "=" * 50)
    print("Audio generation complete!")
    print("=" * 50)

if __name__ == "__main__":
    main()
