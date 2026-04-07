import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ExternalLink, BookOpen } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface FavoriteTip {
  id: number;
  studentId: number;
  tipId: string;
  tipTitle: string;
  tipCategory: string;
  savedAt: Date;
  createdAt: Date;
}

interface MyFavoriteTipsProps {
  onRemove?: (tipId: string) => void;
}

export default function MyFavoriteTips({ onRemove }: MyFavoriteTipsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Buscar favoritos do aluno
  const { data: favoritesData, isLoading, refetch } = trpc.blogEngagement.getFavorites.useQuery();

  // Mutation para remover favorito
  const removeFavoriteMutation = trpc.blogEngagement.removeFavorite.useMutation({
    onSuccess: () => {
      refetch();
      onRemove?.("");
    },
  });

  const favorites = favoritesData?.favorites || [];
  const categories = Array.from(new Set(favorites.map((f: FavoriteTip) => f.tipCategory)));
  const filteredFavorites = selectedCategory
    ? favorites.filter((f: FavoriteTip) => f.tipCategory === selectedCategory)
    : favorites;

  const handleRemoveFavorite = (tipId: string) => {
    removeFavoriteMutation.mutate({ tipId });
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin">
              <Heart className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (favorites.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            Meus Favoritos
          </CardTitle>
          <CardDescription className="text-slate-400">
            Você ainda não salvou nenhuma dica nos favoritos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <img src="/fluxie-thinking.png" alt="Fluxie" className="w-24 h-24 mx-auto mb-4" />
            <p className="text-slate-300 mb-4">
              Clique no ícone de coração para salvar suas dicas favoritas aqui
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400 fill-red-400" />
          Meus Favoritos ({favorites.length})
        </CardTitle>
        <CardDescription className="text-slate-400">
          Dicas que você salvou para revisão posterior
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filtro por categoria */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-700">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-green-500 text-slate-900" : ""}
            >
              Todas ({favorites.length})
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-green-500 text-slate-900" : ""}
              >
                {category} ({favorites.filter((f: FavoriteTip) => f.tipCategory === category).length})
              </Button>
            ))}
          </div>
        )}

        {/* Lista de favoritos */}
        <div className="space-y-3">
          {filteredFavorites.length === 0 ? (
            <p className="text-slate-400 text-center py-4">
              Nenhuma dica salva nesta categoria
            </p>
          ) : (
            filteredFavorites.map((favorite: FavoriteTip) => (
              <div
                key={favorite.id}
                className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-2">{favorite.tipTitle}</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs bg-slate-600 text-slate-200">
                        {favorite.tipCategory}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        Salvo em{" "}
                        {new Date(favorite.savedAt).toLocaleDateString("pt-BR", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-blue-400"
                      asChild
                    >
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-red-400"
                      onClick={() => handleRemoveFavorite(favorite.tipId)}
                      disabled={removeFavoriteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
