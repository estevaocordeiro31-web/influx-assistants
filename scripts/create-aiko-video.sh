#!/bin/bash
# Create Aiko's Sydney Tour video with Ken Burns effect

VIDEO_DIR="/home/ubuntu/influx-assistants/client/public/videos/aiko-sydney"
SCENES_DIR="$VIDEO_DIR/scenes"
AUDIO_DIR="$VIDEO_DIR/audio"
TEMP_DIR="$VIDEO_DIR/temp"

mkdir -p "$TEMP_DIR"

echo "🎬 Creating Aiko's Sydney Tour video..."
echo "================================================"

# Scene durations (from audio files + 0.5s padding)
declare -A DURATIONS
DURATIONS[1]=8.4
DURATIONS[2]=8.0
DURATIONS[3]=7.8
DURATIONS[4]=7.9
DURATIONS[5]=9.1
DURATIONS[6]=8.4

# Create video for each scene with Ken Burns effect
for i in 1 2 3 4 5 6; do
    scene_num=$(printf "%02d" $i)
    duration=${DURATIONS[$i]}
    frames=$(echo "$duration * 30" | bc | cut -d. -f1)
    
    echo "📹 Processing scene $scene_num (${duration}s, ${frames} frames)..."
    
    ffmpeg -y -loop 1 -i "$SCENES_DIR/scene_$scene_num.png" -i "$AUDIO_DIR/scene_$scene_num.mp3" \
        -filter_complex "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0015,1.2)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$frames:s=1920x1080:fps=30[v]" \
        -map "[v]" -map 1:a -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 192k \
        -shortest "$TEMP_DIR/scene_$scene_num.mp4" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "   ✅ Scene $scene_num done"
    else
        echo "   ❌ Scene $scene_num failed"
    fi
done

# Create concat file
echo "📋 Creating concat list..."
rm -f "$TEMP_DIR/concat.txt"
for i in 1 2 3 4 5 6; do
    scene_num=$(printf "%02d" $i)
    echo "file 'scene_$scene_num.mp4'" >> "$TEMP_DIR/concat.txt"
done

# Concatenate all scenes
echo "🔗 Concatenating scenes..."
cd "$TEMP_DIR"
ffmpeg -y -f concat -safe 0 -i concat.txt -c copy "$VIDEO_DIR/aiko-sydney-no-subs.mp4" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Video created: $VIDEO_DIR/aiko-sydney-no-subs.mp4"
    duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO_DIR/aiko-sydney-no-subs.mp4")
    echo "📊 Total duration: ${duration}s"
else
    echo "❌ Failed to concatenate video"
fi

echo "================================================"
echo "🎉 Done!"
