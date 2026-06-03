import React, { useState } from 'react';

interface FavoriteSong {
  id: string;
  title: string;
  artist: string;
  decade: string;
  addedAt: Date;
}

export const KaraokeFavorites: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteSong[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const addToFavorites = (song: FavoriteSong) => {
    setFavorites([...favorites, { ...song, addedAt: new Date() }]);
  };

  const removeFromFavorites = (songId: string) => {
    setFavorites(favorites.filter((fav) => fav.id !== songId));
  };

  return (
    <div className="w-full">
      {/* Botão de Favoritos */}
      <button
        onClick={() => setShowFavorites(!showFavorites)}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition"
      >
        ❤️ Favoritos ({favorites.length})
      </button>

      {/* Lista de Favoritos */}
      {showFavorites && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg border-2 border-red-200">
          <h3 className="text-lg font-bold text-red-900 mb-4">Minhas Músicas Favoritas</h3>

          {favorites.length === 0 ? (
            <p className="text-red-600 text-center py-8">
              Nenhuma música favorita ainda. Clique no ❤️ para adicionar!
            </p>
          ) : (
            <div className="space-y-3">
              {favorites.map((song) => (
                <div
                  key={song.id}
                  className="flex justify-between items-center p-3 bg-white rounded border border-red-200"
                >
                  <div>
                    <p className="font-bold text-gray-900">{song.title}</p>
                    <p className="text-sm text-gray-600">{song.artist}</p>
                    <p className="text-xs text-gray-500">{song.decade}</p>
                  </div>
                  <button
                    onClick={() => removeFromFavorites(song.id)}
                    className="text-red-500 hover:text-red-700 text-xl transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded transition">
            🎵 Cantar Favoritos
          </button>
        </div>
      )}
    </div>
  );
};
