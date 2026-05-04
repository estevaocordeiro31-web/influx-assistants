import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

const ALLOWED_TYPES = ['application/pdf', 'audio/mpeg', 'audio/wav', 'video/mp4', 'video/webm'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface MaterialUploadFormProps {
  onSuccess?: () => void;
}

export function MaterialUploadForm({ onSuccess }: MaterialUploadFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadMutation = trpc.materialUpload.uploadMaterial.useMutation({
    onSuccess: () => {
      toast.success('Material enviado com sucesso!');
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao enviar material');
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Tipo de arquivo não permitido. Use PDF, MP3, WAV, MP4 ou WebM');
      return;
    }

    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Arquivo muito grande. Máximo: 50MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    if (!selectedFile) {
      toast.error('Selecione um arquivo');
      return;
    }

    setIsLoading(true);

    try {
      // Converter arquivo para base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string)?.split(',')[1];
        if (!base64) {
          toast.error('Erro ao processar arquivo');
          setIsLoading(false);
          return;
        }

        await uploadMutation.mutateAsync({
          title,
          description: description || undefined,
          fileBase64: base64,
          mimeType: selectedFile.type,
          fileName: selectedFile.name,
        });

        setIsLoading(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      toast.error('Erro ao enviar arquivo');
      setIsLoading(false);
    }
  };

  const getFileTypeIcon = (type: string | null) => {
    if (!type) return '📄';
    if (type.includes('pdf')) return '📕';
    if (type.includes('audio')) return '🎵';
    if (type.includes('video')) return '🎬';
    return '📄';
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Compartilhar Material
        </CardTitle>
        <CardDescription>
          Envie PDFs, áudios ou vídeos para compartilhar com seus alunos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título do Material *
            </label>
            <Input
              type="text"
              placeholder="Ex: Exercícios de Phrasal Verbs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              className="bg-white dark:bg-gray-800"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição (opcional)
            </label>
            <Textarea
              placeholder="Descreva o conteúdo do material..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
              className="bg-white dark:bg-gray-800"
            />
          </div>

          {/* Upload de arquivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Arquivo *
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.mp3,.wav,.mp4,.webm"
                onChange={handleFileSelect}
                disabled={isLoading}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="flex items-center justify-center w-full p-6 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
              >
                {selectedFile ? (
                  <div className="text-center">
                    <div className="text-4xl mb-2">{getFileTypeIcon(selectedFile.type)}</div>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="font-medium text-gray-900 dark:text-white">
                      Clique ou arraste um arquivo
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      PDF, MP3, WAV, MP4 ou WebM (máx. 50MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Tipos permitidos */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">📕 PDF</Badge>
            <Badge variant="secondary">🎵 MP3</Badge>
            <Badge variant="secondary">🎵 WAV</Badge>
            <Badge variant="secondary">🎬 MP4</Badge>
            <Badge variant="secondary">🎬 WebM</Badge>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !selectedFile || !title.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Compartilhar Material
                </>
              )}
            </Button>
            {selectedFile && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedFile(null)}
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Informações com Fluxie Thinking */}
          <div className="bg-slate-800 border border-purple-500/30 rounded-lg p-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <img 
                  src="/miss-elie-uniform-avatar.png" 
                  alt="Fluxie Thinking" 
                  className="w-10 h-10 object-contain"
                />
                <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full -z-10" />
              </div>
              <div>
                <p className="font-medium mb-1 text-purple-400">💡 Dica do Fluxie:</p>
                <p className="text-slate-300">
                  Você pode compartilhar o material com alunos específicos após o upload. O material
                  será armazenado de forma segura e acessível apenas para os alunos selecionados.
                </p>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
