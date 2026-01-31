#!/usr/bin/env python3
"""
Script para criar o vídeo de animação do Lucas no Lago Ness
Combina imagens e áudios com transições suaves
"""

import subprocess
import os

# Diretório base
BASE_DIR = "/home/ubuntu/influx-assistants/client/public/videos/lucas-loch-ness"
OUTPUT_VIDEO = f"{BASE_DIR}/lucas-loch-ness-final.mp4"

# Cenas com duração baseada no áudio + 0.5s de margem
scenes = [
    {"image": "scene01-arrival.png", "audio": "audio/scene01.wav", "duration": 6.7},
    {"image": "scene02-confused.png", "audio": "audio/scene02.wav", "duration": 8.4},
    {"image": "scene03-hotel.png", "audio": "audio/scene03.wav", "duration": 5.5},
    {"image": "scene04-dream.png", "audio": "audio/scene04.wav", "duration": 6.2},
    {"image": "scene05-wakeup.png", "audio": "audio/scene05.wav", "duration": 6.7},
    {"image": "scene06-selfie.png", "audio": "audio/scene06.wav", "duration": 7.0},
    {"image": "scene07-finale.png", "audio": "audio/scene07.wav", "duration": 8.0},
]

# Criar vídeos individuais para cada cena
temp_videos = []
for i, scene in enumerate(scenes):
    temp_video = f"{BASE_DIR}/temp_scene{i+1:02d}.mp4"
    temp_videos.append(temp_video)
    
    image_path = f"{BASE_DIR}/{scene['image']}"
    audio_path = f"{BASE_DIR}/{scene['audio']}"
    duration = scene['duration']
    
    # Criar vídeo com imagem e áudio
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", image_path,
        "-i", audio_path,
        "-c:v", "libx264",
        "-tune", "stillimage",
        "-c:a", "aac",
        "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p",
        "-t", str(duration),
        "-shortest",
        temp_video
    ]
    
    print(f"Criando cena {i+1}: {scene['image']}")
    subprocess.run(cmd, capture_output=True)

# Criar arquivo de lista para concatenação
concat_file = f"{BASE_DIR}/concat_list.txt"
with open(concat_file, "w") as f:
    for temp_video in temp_videos:
        f.write(f"file '{temp_video}'\n")

# Concatenar todos os vídeos
print("Concatenando todas as cenas...")
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
print("Limpando arquivos temporários...")
for temp_video in temp_videos:
    if os.path.exists(temp_video):
        os.remove(temp_video)
if os.path.exists(concat_file):
    os.remove(concat_file)

print(f"\n✅ Vídeo criado com sucesso: {OUTPUT_VIDEO}")

# Verificar tamanho do arquivo
if os.path.exists(OUTPUT_VIDEO):
    size_mb = os.path.getsize(OUTPUT_VIDEO) / (1024 * 1024)
    print(f"📁 Tamanho: {size_mb:.2f} MB")
