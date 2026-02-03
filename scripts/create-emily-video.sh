#!/bin/bash
# Create Emily's Texas Adventure video with Ken Burns effects

cd /home/ubuntu/influx-assistants/client/public/videos/emily-texas

# Create temp directory
mkdir -p temp

# Scene durations (from audio + 0.5s buffer)
D1=8.5
D2=7.5
D3=7.5
D4=10
D5=10
D6=13

echo "Creating scene videos with Ken Burns effects..."

# Scene 1: Zoom out from truck to reveal Emily
ffmpeg -y -loop 1 -i scenes/scene_01.png -i audio/scene_01.mp3 \
  -filter_complex "[0:v]scale=2880:1620,zoompan=z='1.3-0.3*on/(${D1}*25)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${D1}*25:s=1920x1080:fps=25[v]" \
  -map "[v]" -map 1:a -c:v libx264 -preset fast -crf 18 -c:a aac -shortest temp/scene_01.mp4 2>/dev/null

echo "Scene 1 done"

# Scene 2: Slow pan across the BBQ plate
ffmpeg -y -loop 1 -i scenes/scene_02.png -i audio/scene_02.mp3 \
  -filter_complex "[0:v]scale=2880:1620,zoompan=z='1.2':x='(iw-iw/zoom)*on/(${D2}*25)':y='ih/4':d=${D2}*25:s=1920x1080:fps=25[v]" \
  -map "[v]" -map 1:a -c:v libx264 -preset fast -crf 18 -c:a aac -shortest temp/scene_02.mp4 2>/dev/null

echo "Scene 2 done"

# Scene 3: Zoom in on Emily and cowboy conversation
ffmpeg -y -loop 1 -i scenes/scene_03.png -i audio/scene_03.mp3 \
  -filter_complex "[0:v]scale=2880:1620,zoompan=z='1+0.2*on/(${D3}*25)':x='iw/2-(iw/zoom/2)':y='ih/3-(ih/zoom/3)':d=${D3}*25:s=1920x1080:fps=25[v]" \
  -map "[v]" -map 1:a -c:v libx264 -preset fast -crf 18 -c:a aac -shortest temp/scene_03.mp4 2>/dev/null

echo "Scene 3 done"

# Scene 4: Dynamic pan at the rodeo
ffmpeg -y -loop 1 -i scenes/scene_04.png -i audio/scene_04.mp3 \
  -filter_complex "[0:v]scale=2880:1620,zoompan=z='1.15':x='(iw-iw/zoom)/2+50*sin(on/25)':y='ih/3':d=${D4}*25:s=1920x1080:fps=25[v]" \
  -map "[v]" -map 1:a -c:v libx264 -preset fast -crf 18 -c:a aac -shortest temp/scene_04.mp4 2>/dev/null

echo "Scene 4 done"

# Scene 5: Zoom in on Emily's horrified face with iced tea
ffmpeg -y -loop 1 -i scenes/scene_05.png -i audio/scene_05.mp3 \
  -filter_complex "[0:v]scale=2880:1620,zoompan=z='1+0.25*on/(${D5}*25)':x='iw/2-(iw/zoom/2)':y='ih/3-(ih/zoom/3)':d=${D5}*25:s=1920x1080:fps=25[v]" \
  -map "[v]" -map 1:a -c:v libx264 -preset fast -crf 18 -c:a aac -shortest temp/scene_05.mp4 2>/dev/null

echo "Scene 5 done"

# Scene 6: Slow zoom out at airport
ffmpeg -y -loop 1 -i scenes/scene_06.png -i audio/scene_06.mp3 \
  -filter_complex "[0:v]scale=2880:1620,zoompan=z='1.25-0.2*on/(${D6}*25)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${D6}*25:s=1920x1080:fps=25[v]" \
  -map "[v]" -map 1:a -c:v libx264 -preset fast -crf 18 -c:a aac -shortest temp/scene_06.mp4 2>/dev/null

echo "Scene 6 done"

# Create concat file
echo "file 'temp/scene_01.mp4'
file 'temp/scene_02.mp4'
file 'temp/scene_03.mp4'
file 'temp/scene_04.mp4'
file 'temp/scene_05.mp4'
file 'temp/scene_06.mp4'" > temp/concat.txt

# Concatenate all scenes
echo "Concatenating scenes..."
ffmpeg -y -f concat -safe 0 -i temp/concat.txt -c copy temp/emily-texas-raw.mp4 2>/dev/null

echo "Video created: temp/emily-texas-raw.mp4"

# Get video duration
DURATION=$(ffprobe -i temp/emily-texas-raw.mp4 -show_entries format=duration -v quiet -of csv="p=0")
echo "Total duration: ${DURATION}s"
