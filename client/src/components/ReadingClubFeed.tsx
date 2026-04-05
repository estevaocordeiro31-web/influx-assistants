import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Plus, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

const contentTypeLabels = {
  book: '📚 Livro',
  magazine: '📰 Revista',
  comic: '💭 Gibi',
  podcast: '🎙️ Podcast',
  article: '📄 Artigo',
};

const contentTypeColors = {
  book: 'bg-blue-100 text-blue-800',
  magazine: 'bg-purple-100 text-purple-800',
  comic: 'bg-pink-100 text-pink-800',
  podcast: 'bg-orange-100 text-orange-800',
  article: 'bg-green-100 text-green-800',
};

export function ReadingClubFeed() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    contentType: 'book' as const,
    title: '',
    excerpt: '',
    imageUrl: '',
    sourceUrl: '',
    notes: '',
  });

  const { data: posts = [], isLoading, refetch } = trpc.readingClub.getPosts.useQuery({
    page: 1,
    limit: 20,
    contentType: selectedFilter as any,
  });

  const { data: leaderboard = [] } = trpc.readingClub.getLeaderboard.useQuery({ limit: 5 });

  const createPostMutation = trpc.readingClub.createPost.useMutation({
    onSuccess: () => {
      setFormData({
        contentType: 'book',
        title: '',
        excerpt: '',
        imageUrl: '',
        sourceUrl: '',
        notes: '',
      });
      setShowForm(false);
      refetch();
    },
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    createPostMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">📖 Reading Club</h2>
          <p className="text-muted-foreground">Compartilhe suas leituras e ganhe badges!</p>
        </div>
        {user && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        )}
      </div>

      {/* Create Post Form */}
      {showForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Compartilhe sua leitura</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Tipo de Conteúdo</label>
              <div className="flex gap-2 mt-2">
                {Object.entries(contentTypeLabels).map(([type, label]) => (
                  <Button
                    key={type}
                    variant={formData.contentType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({ ...formData, contentType: type as any })}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: O Pequeno Príncipe"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Trecho/Expressão Favorita</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Compartilhe um trecho que gostou..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">URL da Imagem</label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-sm font-semibold">URL da Fonte</label>
                <Input
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Minhas Notas</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="O que você achou? Qual foi seu aprendizado?"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={createPostMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {createPostMutation.isPending ? 'Compartilhando...' : 'Compartilhar'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedFilter === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(null)}
            >
              Todos
            </Button>
            {Object.entries(contentTypeLabels).map(([type, label]) => (
              <Button
                key={type}
                variant={selectedFilter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(type)}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Posts */}
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Carregando posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum post compartilhado ainda. Seja o primeiro!
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={contentTypeColors[post.contentType as keyof typeof contentTypeColors]}>
                          {contentTypeLabels[post.contentType as keyof typeof contentTypeLabels]}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          por {post.studentName}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}

                  {post.excerpt && (
                    <div className="bg-gray-100 p-4 rounded-lg italic">
                      "{post.excerpt}"
                    </div>
                  )}

                  {post.notes && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Notas:</p>
                      <p className="text-sm text-gray-600">{post.notes}</p>
                    </div>
                  )}

                  {post.sourceUrl && (
                    <a
                      href={post.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Ver fonte →
                    </a>
                  )}

                  <div className="flex gap-4 pt-4 border-t">
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Heart className="w-4 h-4 mr-2" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {post.commentsCount}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🏆 Top Leitores</CardTitle>
              <CardDescription>Alunos mais ativos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-yellow-600">#{idx + 1}</span>
                      <span className="text-sm">{item.studentName}</span>
                    </div>
                    <Badge variant="secondary">{item.postCount} posts</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">💡 Como Funciona</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>✓ Compartilhe livros, revistas, gibis e podcasts</p>
              <p>✓ Ganhe badges por participação</p>
              <p>✓ Troque badges por inFlux Dollars</p>
              <p>✓ Participe de encontros presenciais</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
