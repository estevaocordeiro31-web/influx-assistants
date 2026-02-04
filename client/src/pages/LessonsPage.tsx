import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, GraduationCap, MessageSquare, ChevronRight, Volume2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  
  const { data: stats, isLoading: statsLoading } = trpc.lessons.getBook5Stats.useQuery();
  const { data: lessonData, isLoading: lessonLoading } = trpc.lessons.getLesson.useQuery(
    { lessonId: selectedLesson! },
    { enabled: !!selectedLesson }
  );

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando lições...</div>
      </div>
    );
  }

  if (selectedLesson && lessonData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => setSelectedLesson(null)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para lições
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Lesson {lessonData.lesson.lessonNumber}: {lessonData.lesson.title}
            </h1>
            <p className="text-muted-foreground">
              Book 5 • {lessonData.vocabulary.length} vocabulário • {lessonData.chunks.length} chunks • {lessonData.examples.length} exemplos
            </p>
          </div>

          <Tabs defaultValue="vocabulary" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vocabulary" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Vocabulário ({lessonData.vocabulary.length})
              </TabsTrigger>
              <TabsTrigger value="chunks" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chunks ({lessonData.chunks.length})
              </TabsTrigger>
              <TabsTrigger value="examples" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Exemplos ({lessonData.examples.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vocabulary">
              <Card>
                <CardHeader>
                  <CardTitle>Vocabulário da Lição</CardTitle>
                  <CardDescription>
                    Palavras e expressões introduzidas nesta lição
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {lessonData.vocabulary.map((vocab) => (
                      <div 
                        key={vocab.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <Volume2 className="w-4 h-4" />
                          </Button>
                          <div>
                            <p className="font-medium text-lg">{vocab.word}</p>
                            {vocab.portugueseTranslation && (
                              <p className="text-sm text-muted-foreground">{vocab.portugueseTranslation}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline">Vocabulary</Badge>
                      </div>
                    ))}
                    {lessonData.vocabulary.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum vocabulário específico nesta lição
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chunks">
              <Card>
                <CardHeader>
                  <CardTitle>Chunks & Expressões</CardTitle>
                  <CardDescription>
                    Expressões idiomáticas e collocations para praticar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {lessonData.chunks.map((chunk) => (
                      <div 
                        key={chunk.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <Volume2 className="w-4 h-4" />
                          </Button>
                          <div>
                            <p className="font-medium text-lg">{chunk.expression}</p>
                            {chunk.portugueseEquivalent && (
                              <p className="text-sm text-muted-foreground">{chunk.portugueseEquivalent}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary">{chunk.chunkType}</Badge>
                      </div>
                    ))}
                    {lessonData.chunks.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum chunk específico nesta lição
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples">
              <Card>
                <CardHeader>
                  <CardTitle>Exemplos de Uso</CardTitle>
                  <CardDescription>
                    Frases de exemplo para contextualizar o vocabulário
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {lessonData.examples.map((example) => (
                      <div 
                        key={example.id}
                        className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <Button variant="ghost" size="icon" className="shrink-0 mt-1">
                          <Volume2 className="w-4 h-4" />
                        </Button>
                        <div>
                          <p className="font-medium">{example.sentence}</p>
                          {example.portugueseTranslation && (
                            <p className="text-sm text-muted-foreground mt-1">{example.portugueseTranslation}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {lessonData.examples.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum exemplo específico nesta lição
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Book 5 - Lições</h1>
            <p className="text-muted-foreground">
              Explore o conteúdo do Book 5: vocabulário, chunks e exemplos
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{stats?.totalLessons || 0}</p>
                <p className="text-sm text-muted-foreground">Lições</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">{stats?.totalVocabulary || 0}</p>
                <p className="text-sm text-muted-foreground">Vocabulário</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-500">{stats?.totalChunks || 0}</p>
                <p className="text-sm text-muted-foreground">Chunks</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-500">{stats?.totalExamples || 0}</p>
                <p className="text-sm text-muted-foreground">Exemplos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Units and Lessons */}
        <div className="space-y-6">
          {stats?.units.map((unit) => (
            <Card key={unit.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Unit {unit.id}: {unit.title}
                </CardTitle>
                <CardDescription>
                  {unit.lessonCount} lições • Lessons {unit.lessons[0]} - {unit.lessons[unit.lessons.length - 1]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {unit.lessons.map((lessonNum) => (
                    <Button
                      key={lessonNum}
                      variant="outline"
                      className="h-auto py-4 flex flex-col items-center gap-1"
                      onClick={() => setSelectedLesson(lessonNum)}
                    >
                      <span className="text-lg font-bold">L{lessonNum}</span>
                      <span className="text-xs text-muted-foreground">Ver conteúdo</span>
                      <ChevronRight className="w-4 h-4 mt-1" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
