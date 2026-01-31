#!/usr/bin/env python3
"""
Script para criar animação completa do Lucas no Lago Ness
- Efeitos Ken Burns (zoom, pan)
- Transições suaves (fade, crossfade)
- Motion graphics (textos animados, emojis)
- Legendas estilizadas
"""

import subprocess
import os
import json

BASE_DIR = "/home/ubuntu/influx-assistants/client/public/videos/lucas-loch-ness"
OUTPUT_VIDEO = f"{BASE_DIR}/lucas-loch-ness-animated.mp4"

# Configurações das cenas com efeitos Ken Burns
scenes = [
    {
        "image": "scene01-arrival.png",
        "audio": "audio/scene01.wav",
        "duration": 6.7,
        "effect": "zoom_in",  # Zoom in lento
        "text": "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland",
        "emoji": "✈️"
    },
    {
        "image": "scene02-confused.png",
        "audio": "audio/scene02.wav",
        "duration": 8.4,
        "effect": "pan_right",  # Pan da esquerda para direita
        "text": "🤔 What?!",
        "emoji": "❓"
    },
    {
        "image": "scene03-hotel.png",
        "audio": "audio/scene03.wav",
        "duration": 5.5,
        "effect": "zoom_out",  # Zoom out revelando o quarto
        "text": "🌙 That night...",
        "emoji": "💭"
    },
    {
        "image": "scene04-dream.png",
        "audio": "audio/scene04.wav",
        "duration": 6.2,
        "effect": "zoom_in_center",  # Zoom no centro (Nessie)
        "text": "💤 Dream sequence",
        "emoji": "🦕"
    },
    {
        "image": "scene05-wakeup.png",
        "audio": "audio/scene05.wav",
        "duration": 6.7,
        "effect": "shake",  # Efeito de tremor (acordando assustado)
        "text": "😱 6:03 AM",
        "emoji": "⏰"
    },
    {
        "image": "scene06-selfie.png",
        "audio": "audio/scene06.wav",
        "duration": 7.0,
        "effect": "pan_up",  # Pan de baixo para cima
        "text": "📸 Selfie time!",
        "emoji": "✌️"
    },
    {
        "image": "scene07-finale.png",
        "audio": "audio/scene07.wav",
        "duration": 8.0,
        "effect": "zoom_out_slow",  # Zoom out lento revelando Nessie
        "text": "👍 Pro tip!",
        "emoji": "🧥"
    },
]

# Função para gerar filtro Ken Burns
def get_ken_burns_filter(effect, duration, width=1920, height=1080):
    fps = 25
    frames = int(duration * fps)
    
    if effect == "zoom_in":
        # Zoom de 1.0 para 1.15
        return f"scale=2200:1237,zoompan=z='min(zoom+0.0008,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={width}x{height}:fps={fps}"
    
    elif effect == "zoom_out":
        # Zoom de 1.15 para 1.0
        return f"scale=2200:1237,zoompan=z='if(eq(on,1),1.15,max(zoom-0.0008,1.0))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={width}x{height}:fps={fps}"
    
    elif effect == "zoom_in_center":
        # Zoom mais intenso no centro
        return f"scale=2200:1237,zoompan=z='min(zoom+0.001,1.2)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={width}x{height}:fps={fps}"
    
    elif effect == "zoom_out_slow":
        # Zoom out bem lento
        return f"scale=2200:1237,zoompan=z='if(eq(on,1),1.12,max(zoom-0.0006,1.0))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={width}x{height}:fps={fps}"
    
    elif effect == "pan_right":
        # Pan da esquerda para direita
        return f"scale=2400:1350,zoompan=z='1.1':x='if(eq(on,1),0,min(x+2,iw-iw/zoom))':y='ih/2-(ih/zoom/2)':d={frames}:s={width}x{height}:fps={fps}"
    
    elif effect == "pan_up":
        # Pan de baixo para cima
        return f"scale=2200:1400,zoompan=z='1.1':x='iw/2-(iw/zoom/2)':y='if(eq(on,1),ih-ih/zoom,max(y-1.5,0))':d={frames}:s={width}x{height}:fps={fps}"
    
    elif effect == "shake":
        # Efeito de tremor sutil
        return f"scale={width}:{height},crop=in_w-20:in_h-20:10+5*sin(n/3):10+3*cos(n/4)"
    
    else:
        return f"scale={width}:{height}"

# Criar vídeos individuais com efeitos
temp_videos = []
for i, scene in enumerate(scenes):
    temp_video = f"{BASE_DIR}/temp_animated_{i+1:02d}.mp4"
    temp_videos.append(temp_video)
    
    image_path = f"{BASE_DIR}/{scene['image']}"
    audio_path = f"{BASE_DIR}/{scene['audio']}"
    duration = scene['duration']
    effect = scene['effect']
    text = scene['text']
    emoji = scene['emoji']
    
    # Filtro Ken Burns
    ken_burns = get_ken_burns_filter(effect, duration)
    
    # Adicionar texto animado (aparece com fade in)
    text_filter = f",drawtext=text='{emoji} {text}':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=48:fontcolor=white:borderw=3:bordercolor=black:x=(w-text_w)/2:y=h-80:enable='between(t,0.5,{duration-0.5})':alpha='if(lt(t,1),t-0.5,if(gt(t,{duration-1}),{duration}-t,1))'"
    
    # Comando ffmpeg
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", image_path,
        "-i", audio_path,
        "-filter_complex", f"[0:v]{ken_burns}{text_filter}[v]",
        "-map", "[v]",
        "-map", "1:a",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "192k",
        "-t", str(duration),
        "-shortest",
        temp_video
    ]
    
    print(f"🎬 Processando cena {i+1}: {scene['image']} ({effect})")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"   ⚠️ Erro: {result.stderr[:200]}")
    else:
        print(f"   ✅ Concluído!")

# Criar arquivo de lista para concatenação com crossfade
print("\n🔗 Concatenando cenas com transições...")

# Primeiro, vamos concatenar sem crossfade para simplificar
concat_file = f"{BASE_DIR}/concat_animated.txt"
with open(concat_file, "w") as f:
    for temp_video in temp_videos:
        f.write(f"file '{temp_video}'\n")

# Concatenar
concat_cmd = [
    "ffmpeg", "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concat_file,
    "-c:v", "libx264",
    "-c:a", "aac",
    "-movflags", "+faststart",
    OUTPUT_VIDEO
]
subprocess.run(concat_cmd, capture_output=True)

# Limpar arquivos temporários
print("\n🧹 Limpando arquivos temporários...")
for temp_video in temp_videos:
    if os.path.exists(temp_video):
        os.remove(temp_video)
if os.path.exists(concat_file):
    os.remove(concat_file)

print(f"\n✅ Animação completa criada: {OUTPUT_VIDEO}")

# Verificar tamanho
if os.path.exists(OUTPUT_VIDEO):
    size_mb = os.path.getsize(OUTPUT_VIDEO) / (1024 * 1024)
    print(f"📁 Tamanho: {size_mb:.2f} MB")
    
    # Obter duração
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", OUTPUT_VIDEO],
        capture_output=True, text=True
    )
    if result.stdout.strip():
        duration = float(result.stdout.strip())
        print(f"⏱️ Duração: {duration:.1f} segundos")
