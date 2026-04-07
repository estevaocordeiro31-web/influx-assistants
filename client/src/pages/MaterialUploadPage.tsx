import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload } from 'lucide-react';
import { MaterialUploadForm } from '@/components/MaterialUploadForm';
import { trpc } from '@/lib/trpc';
import { useState } from 'react';

export default function MaterialUploadPage() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: materialsData } = trpc.materialUpload.getAllMaterials.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'admin',
  });

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 font-semibold mb-4">Acesso negado</p>
            <p className="text-gray-600 mb-6">Apenas administradores podem acessar esta página.</p>
            <Button onClick={() => setLocation('/')} className="w-full">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/admin/personalized-links')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Upload className="w-8 h-8" />
            Gerenciar Materiais Exclusivos
          </h1>
          <p className="text-purple-100 mt-2">Compartilhe PDFs, áudios e vídeos com seus alunos</p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Formulário de Upload */}
          <div className="lg:col-span-2">
            <MaterialUploadForm
              onSuccess={() => {
                setRefreshKey((k) => k + 1);
              }}
            />
          </div>

          {/* Materiais Recentes */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white">Materiais Recentes</CardTitle>
                <CardDescription className="text-slate-400">
                  {materialsData?.materials?.length || 0} materiais no total
                </CardDescription>
              </CardHeader>
              <CardContent>
                {materialsData?.materials && materialsData.materials.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {materialsData.materials.slice(0, 5).map((material: any) => (
                      <div
                        key={material.id}
                        className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
                      >
                        <p className="font-medium text-white text-sm truncate">{material.title}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {material.fileType?.toUpperCase()} • {material.size}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(material.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm text-center py-6">
                    Nenhum material compartilhado ainda
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Informações */}
        <Card className="mt-6 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Como funciona</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-3">
            <div>
              <p className="font-semibold text-white mb-1">1. Faça upload do material</p>
              <p className="text-sm">Selecione um arquivo (PDF, áudio ou vídeo) e adicione um título</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">2. Compartilhe com alunos</p>
              <p className="text-sm">
                Após o upload, você pode compartilhar o material com alunos específicos
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">3. Acesso seguro</p>
              <p className="text-sm">
                Os alunos acessam os materiais através da aba "Materiais" no dashboard
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
