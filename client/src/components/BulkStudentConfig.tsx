import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast as showToast } from 'sonner';

interface BulkConfigResult {
  success: number;
  failed: number;
  errors: string[];
}

export function BulkStudentConfig() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<BulkConfigResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = (opts: { title: string; description?: string; variant?: string }) => {
    if (opts.variant === 'destructive') {
      showToast.error(opts.title, { description: opts.description });
    } else {
      showToast.success(opts.title, { description: opts.description });
    }
  };

  const uploadMutation = trpc.bulkConfig.updateFromCSV.useMutation({
    onSuccess: (data: BulkConfigResult) => {
      setResult(data);
      toast({
        title: 'Configuração concluída',
        description: `${data.success} alunos atualizados, ${data.failed} falhas`,
      });
      setIsProcessing(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao processar planilha',
        description: error.message,
        variant: 'destructive',
      });
      setIsProcessing(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validar tipo de arquivo
      if (!selectedFile.name.endsWith('.csv')) {
        toast({
          title: 'Arquivo inválido',
          description: 'Por favor, selecione um arquivo CSV',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    
    // Ler arquivo CSV
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvContent = e.target?.result as string;
      uploadMutation.mutate({ csvContent });
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    // Criar CSV template
    const template = `matricula,nivel,objetivo,book_atual
5361,Conversação Avançada,Carreira,Book 5
6725,Intermediário,Viagens,Book 3
6709,Iniciante,Estudos,Book 1`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_configuracao_alunos.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Template baixado',
      description: 'Preencha o template e faça upload',
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Configuração em Massa</h3>
          <p className="text-sm text-muted-foreground">
            Atualize nível, objetivo e material de múltiplos alunos simultaneamente via planilha CSV
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Baixar Template CSV
          </Button>
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="cursor-pointer flex flex-col items-center gap-4"
          >
            <Upload className="w-12 h-12 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {file ? file.name : 'Clique para selecionar arquivo CSV'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Formato: matricula, nivel, objetivo, book_atual
              </p>
            </div>
          </label>
        </div>

        {file && (
          <Button
            onClick={handleUpload}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Processando...' : 'Atualizar Alunos'}
          </Button>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{result.success} atualizados</span>
              </div>
              {result.failed > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{result.failed} falhas</span>
                </div>
              )}
            </div>

            {result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Erros:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {result.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">📋 Instruções:</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Baixe o template CSV clicando no botão acima</li>
            <li>Preencha com os dados dos alunos (uma linha por aluno)</li>
            <li>Salve o arquivo e faça upload</li>
            <li>Aguarde o processamento e verifique os resultados</li>
          </ol>
        </div>
      </div>
    </Card>
  );
}
