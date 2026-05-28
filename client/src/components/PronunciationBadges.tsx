import { Award, Star, Zap, Trophy } from 'lucide-react';

interface PronunciationBadgesProps {
  pronunciationScore: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  size?: 'sm' | 'md' | 'lg';
}

export function PronunciationBadges({
  pronunciationScore,
  accuracy,
  fluency,
  completeness,
  size = 'md',
}: PronunciationBadgesProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const badges = [];

  // Pronunciation Score Badge
  if (pronunciationScore >= 90) {
    badges.push({
      id: 'perfect-pronunciation',
      label: 'Pronúncia Perfeita',
      icon: Trophy,
      color: 'from-yellow-400 to-orange-500',
      textColor: 'text-yellow-300',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
    });
  } else if (pronunciationScore >= 75) {
    badges.push({
      id: 'excellent-pronunciation',
      label: 'Pronúncia Excelente',
      icon: Star,
      color: 'from-pink-400 to-purple-500',
      textColor: 'text-pink-300',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/30',
    });
  } else if (pronunciationScore >= 60) {
    badges.push({
      id: 'good-pronunciation',
      label: 'Pronúncia Boa',
      icon: Award,
      color: 'from-blue-400 to-cyan-500',
      textColor: 'text-blue-300',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
    });
  }

  // Accuracy Badge
  if (accuracy >= 85) {
    badges.push({
      id: 'high-accuracy',
      label: 'Alta Precisão',
      icon: Zap,
      color: 'from-purple-400 to-pink-500',
      textColor: 'text-purple-300',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
    });
  }

  // Fluency Badge
  if (fluency >= 80) {
    badges.push({
      id: 'fluent-speaker',
      label: 'Fluente',
      icon: Award,
      color: 'from-green-400 to-emerald-500',
      textColor: 'text-green-300',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
    });
  }

  // Completeness Badge
  if (completeness >= 90) {
    badges.push({
      id: 'complete-coverage',
      label: 'Cobertura Completa',
      icon: Trophy,
      color: 'from-orange-400 to-yellow-500',
      textColor: 'text-orange-300',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
    });
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.id}
            className={`${badge.bgColor} border ${badge.borderColor} rounded-full ${sizeClasses[size]} flex items-center gap-1.5 ${badge.textColor}`}
          >
            <Icon size={iconSize[size]} />
            <span className="font-semibold">{badge.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Standalone badge component for leaderboard
export function LeaderboardPronunciationBadges({
  pronunciationScore,
}: {
  pronunciationScore: number;
}) {
  if (pronunciationScore >= 90) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
        <Trophy size={14} className="text-yellow-400" />
        <span className="text-xs font-semibold text-yellow-300">90+%</span>
      </div>
    );
  } else if (pronunciationScore >= 75) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-pink-500/20 border border-pink-500/30">
        <Star size={14} className="text-pink-400" />
        <span className="text-xs font-semibold text-pink-300">75+%</span>
      </div>
    );
  } else if (pronunciationScore >= 60) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
        <Award size={14} className="text-blue-400" />
        <span className="text-xs font-semibold text-blue-300">60+%</span>
      </div>
    );
  }
  return null;
}
