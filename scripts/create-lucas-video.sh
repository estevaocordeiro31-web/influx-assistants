#!/bin/bash
# Create Lucas and the Loch Ness video with Ken Burns effect

VIDEO_DIR="/home/ubuntu/influx-assistants/client/public/videos/lucas-lochness"
SCENES_DIR="$VIDEO_DIR/scenes"
AUDIO_DIR="$VIDEO_DIR/audio"
TEMP_DIR="$VIDEO_DIR/temp"

mkdir -p "$TEMP_DIR"

echo "🎬 Creating Lucas and the Loch Ness video..."
echo "================================================"

# Scene files and durations (from audio files + 0.5s padding)
declare -A SCENE_FILES
SCENE_FILES[1]="scene01-arrival.png"
SCENE_FILES[2]="scene02-confused.png"
SCENE_FILES[3]="scene03-hotel.png"
SCENE_FILES[4]="scene04-dream.png"
SCENE_FILES[5]="scene05-wakeup.png"
SCENE_FILES[6]="scene06-goodbye.png"

declare -A DURATIONS
DURATIONS[1]=9.5
DURATIONS[2]=9.9
DURATIONS[3]=7.4
DURATIONS[4]=8.9
DURATIONS[5]=8.4
DURATIONS[6]=9.1

# Create video for each scene with Ken Burns effect
for i in 1 2 3 4 5 6; do
    scene_file=${SCENE_FILES[$i]}
    duration=${DURATIONS[$i]}
    frames=$(echo "$duration * 30" | bc | cut -d. -f1)
    
    echo "📹 Processing scene $i: $scene_file (${duration}s, ${frames} frames)..."
    
    # Rename audio files to match
    audio_file="$AUDIO_DIR/scene0$i.mp3"
    
    ffmpeg -y -loop 1 -i "$SCENES_DIR/$scene_file" -i "$audio_file" \
        -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0015,1.2)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$frames:s=1920x1080:fps=30[v]" \
        -map "[v]" -map 1:a -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 192k \
        -shortest "$TEMP_DIR/scene0$i.mp4" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "   ✅ Scene $i done"
    else
        echo "   ❌ Scene $i failed"
    fi
done

# Create concat file
echo "📋 Creating concat list..."
rm -f "$TEMP_DIR/concat.txt"
for i in 1 2 3 4 5 6; do
    echo "file 'scene0$i.mp4'" >> "$TEMP_DIR/concat.txt"
done

# Concatenate all scenes
echo "🔗 Concatenating scenes..."
cd "$TEMP_DIR"
ffmpeg -y -f concat -safe 0 -i concat.txt -c copy "$VIDEO_DIR/lucas-lochness-no-subs.mp4" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Video created: $VIDEO_DIR/lucas-lochness-no-subs.mp4"
    duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO_DIR/lucas-lochness-no-subs.mp4")
    echo "📊 Total duration: ${duration}s"
else
    echo "❌ Failed to concatenate video"
fi

echo "================================================"
echo "🎉 Done!"
