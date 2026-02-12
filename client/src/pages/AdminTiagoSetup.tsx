/**
 * Admin Tiago Setup Page
 * Página de administração para criar usuário Tiago
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export function AdminTiagoSetup() {
  const [step, setStep] = useState<'welcome' | 'creating' | 'success' | 'error'>('welcome');
  const [errorMessage, setErrorMessage] = useState('');

  const createUserMutation = trpc.userManagement.createSpecialUser.useMutation();

  const handleCreateTiago = async () => {
    try {
      setStep('creating');
      setErrorMessage('');

      const response = await createUserMutation.mutateAsync({
        email: 'tiago.laerte@icloud.com',
        name: 'Tiago Laerte Marques',
        phone: '11920409000',
        currentLevel: 'elementary',
        objective: 'career',
        profession: 'Médico',
      });

      console.log('Usuário criado:', response);
      setStep('success');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro desconhecido ao criar usuário'
      );
      setStep('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Welcome Step */}
        {step === 'welcome' && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">🎯 Criar Acesso para Tiago</CardTitle>
              <CardDescription className="text-slate-400">
                Configurar usuário Tiago Laerte Marques com acesso personalizado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-700/50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-white">Dados do Usuário:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Nome:</span>
                    <p className="text-white font-medium">Tiago Laerte Marques</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span>
                    <p className="text-white font-medium">tiago.laerte@icloud.com</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Telefone:</span>
                    <p className="text-white font-medium">(11) 92040-9000</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Profissão:</span>
                    <p className="text-white font-medium">Médico</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Nível:</span>
                    <p className="text-white font-medium">Elementary (Book 2)</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Objetivo:</span>
                    <p className="text-white font-medium">Carreira Profissional</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  ℹ️ Ao clicar em "Criar Usuário", será registrado um novo usuário no banco de dados
                  com acesso personalizado às abas Profissional e Traveller.
                </p>
              </div>

              <Button
                onClick={handleCreateTiago}
                disabled={createUserMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg"
              >
                {createUserMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Criando usuário...
                  </>
                ) : (
                  <>
                    Criar Usuário Tiago
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Creating Step */}
        {step === 'creating' && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-12 pb-12 text-center space-y-4">
              <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto" />
              <p className="text-white text-lg font-semibold">Criando usuário...</p>
              <p className="text-slate-400">Por favor, aguarde</p>
            </CardContent>
          </Card>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <Card className="bg-slate-800/50 border-slate-700 border-green-500/50">
            <CardContent className="pt-12 pb-12 space-y-6">
              <div className="text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-white">Usuário Criado com Sucesso!</h2>
                <p className="text-slate-400">
                  Tiago Laerte Marques foi registrado no sistema
                </p>
              </div>

              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-green-300">✅ Próximas Etapas:</h3>
                <ol className="space-y-2 text-sm text-green-200">
                  <li>1. Fazer logout e login com email: tiago.laerte@icloud.com</li>
                  <li>2. Acessar a rota /tiago para ver o painel personalizado</li>
                  <li>3. Visualizar abas "Profissional" e "Traveller"</li>
                  <li>4. Verificar avatar caricato e barra de progresso</li>
                </ol>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Ir para Home
                </Button>
                <Button
                  onClick={() => window.location.href = '/tiago'}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Acessar Página de Tiago
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Step */}
        {step === 'error' && (
          <Card className="bg-slate-800/50 border-slate-700 border-red-500/50">
            <CardContent className="pt-12 pb-12 space-y-6">
              <div className="text-center space-y-4">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-white">Erro ao Criar Usuário</h2>
                <p className="text-slate-400">
                  Houve um problema durante a criação do usuário
                </p>
              </div>

              <Alert className="bg-red-500/20 border-red-500/50">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  {errorMessage}
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => setStep('welcome')}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default AdminTiagoSetup;
