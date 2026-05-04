import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Photo {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  likes: number;
  comments: number;
  liked: boolean;
}

const SAMPLE_PHOTOS: Photo[] = [
  {
    id: "1",
    title: "Encontro Presencial #1",
    description: "Primeiro encontro do Reading Club - Discussão sobre 'The Boogeyman'",
    image: "/miss-elie-uniform-teaching.png",
    date: "23 de janeiro de 2026",
    likes: 12,
    comments: 3,
    liked: false,
  },
  {
    id: "2",
    title: "Dramatização da Cena",
    description: "Alunos dramatizando trechos do livro",
    image: "/miss-elie-uniform-teaching.png",
    date: "23 de janeiro de 2026",
    likes: 8,
    comments: 2,
    liked: false,
  },
  {
    id: "3",
    title: "Momento de Diversão",
    description: "Alunos se divertindo durante a atividade",
    image: "/miss-elie-uniform-teaching.png",
    date: "23 de janeiro de 2026",
    likes: 15,
    comments: 5,
    liked: false,
  },
];

export function BoogeymanPhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>(SAMPLE_PHOTOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());

  const currentPhoto = photos[currentIndex];

  const handleLike = (photoId: string) => {
    const newLiked = new Set(likedPhotos);
    if (newLiked.has(photoId)) {
      newLiked.delete(photoId);
    } else {
      newLiked.add(photoId);
    }
    setLikedPhotos(newLiked);

    setPhotos(
      photos.map((photo) =>
        photo.id === photoId
          ? { ...photo, likes: photo.likes + (newLiked.has(photoId) ? 1 : -1) }
          : photo
      )
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
          📸 Galeria de Momentos
        </h2>
        <p className="text-slate-400">
          Reviva os melhores momentos do Reading Club. Curta, comente e compartilhe!
        </p>
      </div>

      {/* Galeria Principal */}
      <Card className="bg-slate-900 border-slate-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Moldura Elegante com Efeito Polaroid */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8">
              <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden">
                {/* Imagem */}
                <div className="aspect-video bg-slate-800 relative">
                  <img
                    src={currentPhoto.image}
                    alt={currentPhoto.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay com Gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />

                  {/* Badge de Data */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-slate-900 font-semibold">
                      {currentPhoto.date}
                    </Badge>
                  </div>
                </div>

                {/* Rodapé da Moldura (estilo Polaroid) */}
                <div className="bg-white p-6 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {currentPhoto.title}
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">
                      {currentPhoto.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 text-sm text-slate-600 border-t pt-3">
                    <span>❤️ {currentPhoto.likes} curtidas</span>
                    <span>💬 {currentPhoto.comments} comentários</span>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
                      onClick={() => handleLike(currentPhoto.id)}
                    >
                      <Heart
                        className={`w-4 h-4 mr-2 ${
                          likedPhotos.has(currentPhoto.id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                      Curtir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Comentar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>

                  {/* Influxcoin Info */}
                  <div className="bg-green-500/10 border border-green-500/30 rounded p-2 text-xs text-slate-700">
                    💰 Ganhe <span className="font-bold text-green-600">+1 influxcoin</span> por curtir
                    e <span className="font-bold text-green-600">+2 influxcoin</span> por comentar!
                  </div>
                </div>
              </div>
            </div>

            {/* Navegação */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                onClick={handlePrev}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white rounded-full"
                onClick={handleNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Indicador de Posição */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {currentIndex + 1} / {photos.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Miniaturas */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-300">Todas as Fotos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-green-500 shadow-lg shadow-green-500/50"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs text-white font-semibold truncate">
                  {photo.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <Card className="bg-slate-900 border-slate-700 border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <Upload className="w-8 h-8 text-green-400" />
            <div>
              <p className="font-semibold text-slate-100">
                Adicione suas fotos do evento
              </p>
              <p className="text-sm text-slate-400">
                Coordenadores podem fazer upload de fotos para compartilhar com alunos
              </p>
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-slate-900 font-semibold ml-auto">
              Upload
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-green-400">{photos.length}</p>
            <p className="text-xs text-slate-400 mt-1">Fotos</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-green-400">
              {photos.reduce((sum, p) => sum + p.likes, 0)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Curtidas</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-green-400">
              {photos.reduce((sum, p) => sum + p.comments, 0)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Comentários</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
