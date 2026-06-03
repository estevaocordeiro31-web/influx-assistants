import React, { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';

interface Player {
  id: string;
  name: string;
  score: number;
  isCurrentPlayer: boolean;
}

export const KaraokeMultiplayerRealtime: React.FC<{ roomId: string; decade: string }> = ({
  roomId,
  decade,
}) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Simular conexão WebSocket
  useEffect(() => {
    setIsConnected(true);
    // Em produção, usar WebSocket real
    const interval = setInterval(() => {
      // Atualizar estado da sala
    }, 1000);

    return () => clearInterval(interval);
  }, [roomId]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🎤 Competição em Tempo Real</h2>
        <p className="text-purple-200">Sala: {roomId}</p>
      </div>

      {/* Placar dos Jogadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {players.map((player) => (
          <div
            key={player.id}
            className={`p-4 rounded-lg border-2 ${
              player.isCurrentPlayer
                ? 'border-yellow-400 bg-yellow-900 bg-opacity-30'
                : 'border-purple-400 bg-purple-800 bg-opacity-30'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-bold text-lg">{player.name}</p>
                <p className="text-purple-200 text-sm">
                  {player.isCurrentPlayer ? '🎵 Cantando...' : 'Aguardando...'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-yellow-300">{player.score}</p>
                <p className="text-purple-200 text-xs">pontos</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status de Conexão */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <p className="text-white text-sm">
          {isConnected ? 'Conectado em tempo real' : 'Desconectado'}
        </p>
      </div>

      {/* Botão de Pronto */}
      <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 rounded-lg transition">
        🎵 Pronto para Cantar
      </button>
    </div>
  );
};
