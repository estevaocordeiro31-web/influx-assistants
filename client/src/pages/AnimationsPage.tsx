import { useState } from "react";
import { ArrowLeft, Play, Film, Globe } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VideoPlayer } from "@/components/VideoPlayer";

// Animation data
const animations = [
  {
    id: "emily-texas",
    title: "Emily's Texas Adventure",
    character: "Emily",
    flag: "🇬🇧",
    description: "Emily visits Texas and discovers that everything is bigger in the Lone Star State!",
    thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/LpGXrOihHjIjpArw.png",
    videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/WDmUXTecOMowvCJM.mp4",
    subtitles: [
      {
        label: "English",
        srclang: "en",
        src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/kYXLktuonKmxIgip.vtt",
      },
      {
        label: "Português",
        srclang: "pt",
        src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/ApdiNOiDEXLsZaXX.vtt",
      },
    ],
    duration: "1:03",
    accent: "British English",
  },
  {
    id: "aiko-sydney",
    title: "Aiko's Sydney Tour",
    character: "Aiko",
    flag: "🇦🇺",
    description: "Aiko explores Sydney and experiences Australian culture, from the Opera House to Vegemite!",
    thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/tBESoEpKJJPSiKTO.png",
    videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/eNdjiqugGmEJQgRE.mp4",
    subtitles: [
      {
        label: "English",
        srclang: "en",
        src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/TrnCGIZtijlTKymO.vtt",
      },
      {
        label: "Português",
        srclang: "pt",
        src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/rIvQroiZqgmnIxJN.vtt",
      },
    ],
    duration: "0:57",
    accent: "Australian English",
  },
  {
    id: "lucas-lochness",
    title: "Lucas and the Loch Ness",
    character: "Lucas",
    flag: "🇺🇸",
    description: "Lucas travels to Scotland and dreams of meeting the legendary Loch Ness Monster!",
    thumbnail: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/HKJrxYrZsLNxrhVB.png",
    videoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/qcOCQVBVeNQFIbFC.mp4",
    subtitles: [
      {
        label: "English",
        srclang: "en",
        src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/hVUlQIilaYzdHCtF.vtt",
      },
      {
        label: "Português",
        srclang: "pt",
        src: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/cHwyEDYUSYpCwLkx.vtt",
      },
    ],
    duration: "1:01",
    accent: "American English",
  },
];

export default function AnimationsPage() {
  const [selectedAnimation, setSelectedAnimation] = useState<typeof animations[0] | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Animations</h1>
                <p className="text-sm text-gray-400">Watch and learn with our characters</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {selectedAnimation ? (
          /* Video Player View */
          <div className="max-w-5xl mx-auto">
            {/* Back button */}
            <Button
              variant="ghost"
              onClick={() => setSelectedAnimation(null)}
              className="text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to animations
            </Button>

            {/* Video Player */}
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <VideoPlayer
                src={selectedAnimation.videoUrl}
                title={selectedAnimation.title}
                poster={selectedAnimation.thumbnail}
                subtitles={selectedAnimation.subtitles}
                className="aspect-video"
              />
            </div>

            {/* Video Info */}
            <div className="mt-6 bg-white/5 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedAnimation.title}
                  </h2>
                  <p className="text-gray-300 mb-4">{selectedAnimation.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2 text-purple-300">
                      <span className="text-xl">{selectedAnimation.flag}</span>
                      {selectedAnimation.character}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Globe className="w-4 h-4" />
                      {selectedAnimation.accent}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{selectedAnimation.duration}</span>
                  </div>
                </div>
              </div>

              {/* Subtitle info */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Available Subtitles</h3>
                <div className="flex gap-2">
                  {selectedAnimation.subtitles.map((sub) => (
                    <span
                      key={sub.srclang}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                    >
                      {sub.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Animation Grid */
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Featured Animations</h2>
              <p className="text-gray-400">
                Watch fun stories with Lucas, Emily, and Aiko to improve your English!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animations.map((animation) => (
                <Card
                  key={animation.id}
                  className="bg-white/5 border-white/10 overflow-hidden hover:bg-white/10 transition-colors cursor-pointer group"
                  onClick={() => setSelectedAnimation(animation)}
                >
                  <div className="relative aspect-video">
                    <img
                      src={animation.thumbnail}
                      alt={animation.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                      {animation.duration}
                    </div>
                    <div className="absolute top-2 left-2 text-2xl">
                      {animation.flag}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {animation.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {animation.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded">
                        {animation.character}
                      </span>
                      <span className="text-xs text-gray-500">
                        {animation.accent}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Coming Soon Cards */}
              {["Lucas in New York", "Emily in Paris"].map((title) => (
                <Card
                  key={title}
                  className="bg-white/5 border-white/10 overflow-hidden opacity-50"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <Film className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <span className="text-gray-500 text-sm">Coming Soon</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-500 mb-1">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Stay tuned for more adventures!
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
