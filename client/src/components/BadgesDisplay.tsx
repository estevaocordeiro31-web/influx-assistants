import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface BadgeItem {
  id: number;
  studentId: number;
  badgeName: string;
  badgeDescription: string;
  badgeIcon: string | null;
  tipsCompleted: number;
  unlockedAt: Date;
  createdAt: Date;
}

export default function BadgesDisplay() {
  // Buscar badges do aluno
  const { data: badgesData, isLoading } = trpc.blogEngagement.getBadges.useQuery();

  const badges = badgesData?.badges || [];

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Minhas Conquistas
        </CardTitle>
        <CardDescription className="text-slate-400">
          Badges desbloqueados através de engajamento com o blog
        </CardDescription>
      </CardHeader>

      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-8">
            <img src="/miss-elie-uniform-thumbsup.png" alt="Fluxie" className="w-24 h-24 mx-auto mb-4" />
            <p className="text-slate-300 mb-2">Nenhum badge desbloqueado ainda</p>
            <p className="text-slate-400 text-sm">
              Comece a salvar dicas e marcar como úteis para desbloquear badges!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge: BadgeItem) => (
              <div
                key={badge.id}
                className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-lg p-4 text-center hover:border-yellow-500/50 transition-colors"
              >
                <div className="text-3xl mb-2">{badge.badgeIcon}</div>
                <h3 className="text-white font-bold text-sm mb-1">{badge.badgeName}</h3>
                <p className="text-slate-400 text-xs mb-3">{badge.badgeDescription}</p>
                <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-300">
                  {badge.tipsCompleted} dicas
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Próximos badges a desbloquear */}
        {badges.length < 4 && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h4 className="text-white font-semibold text-sm mb-3">Próximos Badges:</h4>
            <div className="space-y-2">
              {badges.length === 0 && (
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <p className="text-slate-300 text-sm font-medium">🌱 Primeiro Passo</p>
                    <p className="text-slate-400 text-xs">Leia a primeira dica do blog</p>
                  </div>
                </div>
              )}
              {badges.length < 2 && (
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <p className="text-slate-300 text-sm font-medium">⭐ Colecionador de Dicas</p>
                    <p className="text-slate-400 text-xs">Salve 5 dicas nos favoritos</p>
                  </div>
                </div>
              )}
              {badges.length < 3 && (
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <p className="text-slate-300 text-sm font-medium">🎯 Aprendiz Engajado</p>
                    <p className="text-slate-400 text-xs">Marque 10 dicas como úteis</p>
                  </div>
                </div>
              )}
              {badges.length < 4 && (
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <p className="text-slate-300 text-sm font-medium">👑 Mestre do Blog</p>
                    <p className="text-slate-400 text-xs">Complete 20 dicas</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
