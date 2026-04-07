import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Play, Pause, Volume2, VolumeX, Maximize, Subtitles, ChevronDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface SubtitleOption {
  id: string;
  label: string;
  file: string;
}

interface VideoPlayerProps {
  title: string;
  character: 'lucas' | 'emily' | 'aiko';
  thumbnail?: string;
  videos: {
    noSubs: string;
    englishOnly: string;
    dualSubs: string;
  };
  duration: string;
  onComplete?: () => void;
}

const characterColors = {
  lucas: 'from-blue-500 to-blue-700',
  emily: 'from-pink-500 to-pink-700',
  aiko: 'from-purple-500 to-purple-700',
};

const characterFlags = {
  lucas: '🇺🇸',
  emily: '🇬🇧',
  aiko: '🇦🇺',
};

export function VideoPlayer({ 
  title, 
  character, 
  thumbnail,
  videos,
  duration,
  onComplete 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [subtitleMode, setSubtitleMode] = useState<'none' | 'english' | 'dual'>('dual');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const subtitleOptions: SubtitleOption[] = [
    { id: 'none', label: 'Sem legendas', file: videos.noSubs },
    { id: 'english', label: '🇺🇸 English Only', file: videos.englishOnly },
    { id: 'dual', label: '🇺🇸 English + 🇧🇷 Português', file: videos.dualSubs },
  ];

  const currentVideo = subtitleOptions.find(opt => opt.id === subtitleMode)?.file || videos.dualSubs;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setVideoDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  // Preserve playback position when changing subtitle mode
  useEffect(() => {
    const video = videoRef.current;
    if (video && currentTime > 0) {
      video.currentTime = currentTime;
      if (isPlaying) {
        video.play();
      }
    }
  }, [subtitleMode]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="overflow-hidden bg-gray-900 border-gray-700">
      <CardContent className="p-0">
        {/* Video Container */}
        <div 
          className="relative aspect-video bg-black group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(isPlaying ? false : true)}
        >
          <video
            ref={videoRef}
            src={currentVideo}
            poster={thumbnail}
            className="w-full h-full object-contain"
            onClick={togglePlay}
          />

          {/* Play Button Overlay (when paused) */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
              onClick={togglePlay}
            >
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${characterColors[character]} flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}>
                <Play className="w-10 h-10 text-white ml-1" fill="white" />
              </div>
            </div>
          )}

          {/* Controls Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            {/* Progress Bar */}
            <div className="mb-3">
              <Slider
                value={[currentTime]}
                max={videoDuration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>

                {/* Time */}
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(videoDuration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Subtitle Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 gap-1"
                    >
                      <Subtitles className="w-4 h-4" />
                      <span className="text-xs hidden sm:inline">
                        {subtitleMode === 'none' ? 'OFF' : subtitleMode === 'english' ? 'EN' : 'EN+PT'}
                      </span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                    {subtitleOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.id}
                        onClick={() => setSubtitleMode(option.id as 'none' | 'english' | 'dual')}
                        className={`text-white hover:bg-gray-700 cursor-pointer ${
                          subtitleMode === option.id ? 'bg-gray-700' : ''
                        }`}
                      >
                        {option.label}
                        {subtitleMode === option.id && <span className="ml-2">✓</span>}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Fullscreen */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Character Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1">
            <span className="text-lg">{characterFlags[character]}</span>
            <span className="text-white text-sm font-medium capitalize">{character}</span>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-4 bg-gray-800">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <p className="text-gray-400 text-sm mt-1">Duração: {duration}</p>
        </div>
      </CardContent>
    </Card>
  );
}
