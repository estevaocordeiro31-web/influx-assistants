# Animated Videos Integration Guide

## Overview

This guide covers integrating animated educational videos with the animated-video-producer skill. Videos feature Disney Pixar 3D animation, Ken Burns effects, TTS audio, and dual-language subtitles.

## Video Data Structure

Each video is defined with scenes, subtitles, and metadata:

```json
{
  "unit": 1,
  "title": "Meeting New People",
  "filename": "vacation-plus-1",
  "images": [
    "scene1.png",
    "scene2.png",
    "scene3.png"
  ],
  "subtitles_en": [
    "Hey there! I'm Lucas from New York.",
    "I'm here for the tech conference."
  ],
  "subtitles_pt": [
    "Oi! Sou Lucas de Nova York.",
    "Estou aqui para a conferência de tecnologia."
  ]
}
```

## Implementation Steps

### Step 1: Define Video Content

Create a JSON file with video data:

```json
{
  "vacation_plus_1": {
    "unit": 1,
    "title": "Meeting New People",
    "scenes": [
      {
        "number": 1,
        "character": "lucas",
        "location": "Conference lobby",
        "action": "Lucas walks confidently",
        "en": "Hey there! I'm Lucas from New York.",
        "pt": "Oi! Sou Lucas de Nova York."
      }
    ]
  }
}
```

### Step 2: Generate Images

Use the `generate_image` tool to create Disney Pixar 3D style images:

```
Disney Pixar 3D animation style, [character description], [action], [location], 
bright lighting, vibrant colors, high quality render
```

Generate 5-7 images per video for optimal pacing.

### Step 3: Generate Audio

Use the `generate_speech` tool with the English text of all scenes:

```
Scene 1 text... Scene 2 text... Scene 3 text...
```

This creates a single audio file with all dialogue.

### Step 4: Create Video with animated-video-producer

Use the animated-video-producer skill to generate the final video:

```bash
python /home/ubuntu/skills/animated-video-producer/scripts/generate_videos.py
```

The script will:
- Apply Ken Burns effects (zoom, pan, rotate)
- Synchronize audio with scenes
- Add dual-language subtitles (EN bottom, PT top)
- Export as MP4

### Step 5: Upload and Store

Upload videos to S3:

```bash
manus-upload-file video.mp4
```

Store the returned URL in your database:

```typescript
const videoUrl = "https://cdn.example.com/vacation-plus-1.mp4";
```

## Ken Burns Effects

The system applies 7 different effects that alternate:

| Effect | Description |
|--------|-------------|
| 0 | Zoom in central |
| 1 | Zoom out central |
| 2 | Pan left→right |
| 3 | Zoom in + pan down |
| 4 | Pan right→left |
| 5 | Zoom in corner |
| 6 | Zoom out with focus |

Effects are applied sequentially to keep videos visually interesting.

## Subtitle Formatting

Subtitles are rendered in ASS format with two styles:

- **English**: Arial 34px, white text, black border, bottom alignment
- **Portuguese**: Arial 30px, yellow text, black border, top alignment

Subtitles sync automatically with audio duration.

## Video Quality Guidelines

- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30fps
- **Duration**: 15-45 seconds ideal
- **Scene Duration**: 2-5 seconds each
- **Audio**: 128kbps MP3 or higher

## Character Consistency

For recurring characters, maintain consistency:

1. Use the same character description in all prompts
2. Reference previous images when generating new ones
3. Keep clothing, hair, and features identical
4. Maintain consistent lighting and environment style

## Integration with Quiz System

Link videos to quizzes:

```typescript
// Save video watched
const videoWatched = await db.insert(videoProgress).values({
  studentId: ctx.user.id,
  videoId: "vp1-unit-1",
  videoTitle: "Meeting New People",
  watchedAt: new Date(),
});

// Then save quiz result
const quizResult = await saveQuizResult({
  videoId: "vp1-unit-1",
  videoTitle: "Meeting New People",
  score: 85,
  totalQuestions: 5,
  correctAnswers: 4,
});
```

## Troubleshooting

### Audio/Video Sync Issues

- Ensure audio duration matches total scene duration
- Check that scene durations are calculated correctly
- Verify FFmpeg is installed and working

### Subtitle Positioning

- English subtitles should appear at bottom
- Portuguese subtitles should appear at top
- Adjust font sizes if text overlaps

### Ken Burns Effects Not Applying

- Verify image dimensions are consistent (e.g., 2752x1536)
- Check that effect indices are within 0-6 range
- Ensure FFmpeg has video filter support

## Performance Tips

1. **Pre-generate images** - Generate all images before creating video
2. **Batch processing** - Create multiple videos in sequence
3. **Cache audio** - Reuse audio files for similar content
4. **Compress output** - Use H.264 codec for smaller file sizes

## Accessibility

- Always include subtitles in both languages
- Use clear, simple English and Portuguese
- Maintain consistent speaking pace
- Avoid background noise in audio
