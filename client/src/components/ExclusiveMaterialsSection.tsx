import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Lock, FileText, BookOpen, Music, Video } from 'lucide-react';
import { toast } from 'sonner';

interface Material {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'audio' | 'video' | 'document';
  size: string;
  sharedBy: string;
  sharedAt: Date;
  url?: string;
}

interface ExclusiveMaterialsSectionProps {
  materials?: Material[];
  isLoading?: boolean;
}

export function ExclusiveMaterialsSection({ 
  materials = [], 
  isLoading = false 
}: ExclusiveMaterialsSectionProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-blue-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />;
      case 'document':
        return <BookOpen className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      pdf: 'PDF',
      audio: 'Áudio',
      video: 'Vídeo',
      document: 'Documento',
    };
    return labels[type] || type;
  };

  const handleDownload = (material: Material) => {
    if (material.url) {
      window.open(material.url, '_blank');
      toast.success(`Baixando ${material.title}...`);
    } else {
      toast.error('Link de download não disponível');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="text-center py-12">
        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nenhum Material Exclusivo
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Materiais exclusivos compartilhados com você aparecerão aqui
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Seu coordenador pode compartilhar PDFs, áudios, vídeos e documentos especiais
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {materials.map((material) => (
        <Card 
          key={material.id} 
          className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg mt-1">
                  {getIcon(material.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {material.title}
                    </h3>
                    <Badge variant="secondary" className="whitespace-nowrap">
                      {getTypeLabel(material.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {material.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                    <span>{material.size}</span>
                    <span>•</span>
                    <span>Compartilhado por {material.sharedBy}</span>
                    <span>•</span>
                    <span>{material.sharedAt.toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap"
                onClick={() => handleDownload(material)}
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
