import React, { useState, useEffect } from 'react';

interface Challenge {
  weekNumber: number;
  songId: string;
  songTitle: string;
  artist: string;
  description: string;
  rewards: {
    first: { badge: string; points: number };
    second: { badge: string; points: number };
    third: { badge: string; points: number };
  };
}

export const KaraokeWeeklyChallenge: React.FC = () => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userScore, setUserScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [badge, setBadge] = useState<string | null>(null);

  useEffect(() => {
    // Simular carregamento do desafio
    const weekNumber = Math.floor((Date.now() - new Date(2024, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    setChallenge({
      weekNumber,
      songId: 'blinding-lights',
      songTitle: 'Blinding Lights',
      artist: 'The Weeknd',
      description: 'Cante Blinding Lights esta semana e ganhe 50 pontos extras!',
      rewards: {
        first: { badge: 'Challenge Master 🏆', points: 100 },
        second: { badge: 'Challenge Expert 🥈', points: 75 },
        third: { badge: 'Challenge Participant 🥉', points: 50 },
      },
    });
  }, []);

  const handleCompleteChallenge = () => {
    setCompleted(true);
    if (userScore > 80) {
      setBadge(challenge?.rewards.first.badge || null);
    } else if (userScore > 60) {
      setBadge(challenge?.rewards.second.badge || null);
    } else {
      setBadge(challenge?.rewards.third.badge || null);
    }
  };

  if (!challenge) return null;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🎯 Desafio da Semana #{challenge.weekNumber}</h2>
        <p className="text-yellow-100">{challenge.description}</p>
      </div>

      {/* Música do Desafio */}
      <div className="bg-white bg-opacity-20 p-4 rounded-lg mb-6">
        <p className="text-yellow-100 text-sm mb-2">Música do Desafio:</p>
        <h3 className="text-2xl font-bold text-white">{challenge.songTitle}</h3>
        <p className="text-yellow-100">{challenge.artist}</p>
      </div>

      {/* Recompensas */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-yellow-300 p-3 rounded text-center">
          <p className="text-2xl mb-1">🏆</p>
          <p className="font-bold text-gray-900">{challenge.rewards.first.badge}</p>
          <p className="text-sm text-gray-700">+{challenge.rewards.first.points} pts</p>
        </div>
        <div className="bg-gray-300 p-3 rounded text-center">
          <p className="text-2xl mb-1">🥈</p>
          <p className="font-bold text-gray-900">{challenge.rewards.second.badge}</p>
          <p className="text-sm text-gray-700">+{challenge.rewards.second.points} pts</p>
        </div>
        <div className="bg-orange-300 p-3 rounded text-center">
          <p className="text-2xl mb-1">🥉</p>
          <p className="font-bold text-gray-900">{challenge.rewards.third.badge}</p>
          <p className="text-sm text-gray-700">+{challenge.rewards.third.points} pts</p>
        </div>
      </div>

      {/* Status do Desafio */}
      {completed ? (
        <div className="bg-white bg-opacity-30 p-4 rounded-lg text-center">
          <p className="text-2xl mb-2">✨ Parabéns!</p>
          <p className="text-white font-bold mb-2">Você ganhou o badge:</p>
          <p className="text-3xl mb-3">{badge}</p>
          <p className="text-yellow-100">Volte na próxima semana para um novo desafio!</p>
        </div>
      ) : (
        <button
          onClick={handleCompleteChallenge}
          className="w-full bg-white hover:bg-yellow-50 text-orange-600 font-bold py-3 rounded-lg transition"
        >
          🎵 Aceitar Desafio
        </button>
      )}
    </div>
  );
};
