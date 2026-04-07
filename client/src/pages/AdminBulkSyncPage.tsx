                </div>
                <AlertDescription className="ml-2">{syncMessage}</AlertDescription>
              </Alert>
            )}

            {/* Botão de sincronização */}
            <div className="space-y-4">
              <Button
                onClick={() => handleSync()}
                disabled={syncStatus === 'syncing'}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 text-lg"
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 mr-2" />
                    Sincronizar 182 Alunos
                  </>
                )}
              </Button>

              <p className="text-sm text-gray-600 text-center">
                Esta ação importará todos os alunos ativos do Dashboard central com seus dados de nível, livros e cursos.
              </p>
            </div>

            {/* Informações */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
              <h3 className="font-semibold text-gray-900">O que será sincronizado:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Nome completo do aluno</li>
                <li>✓ Email e telefone</li>
                <li>✓ Nível (Book 1-5)</li>
                <li>✓ Livros já cursados</li>
                <li>✓ Cursos extras inscritos</li>
                <li>✓ Objetivo de aprendizado</li>
                <li>✓ Senhas temporárias</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Próximos passos */}
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>1. Sincronizar alunos:</strong> Clique no botão acima para importar os 182 alunos do Dashboard
            </p>
            <p>
              <strong>2. Gerar mensagens:</strong> Crie 182 mensagens personalizadas com nome, nível e data de desbloqueio
            </p>
            <p>
              <strong>3. Enviar credenciais:</strong> O webhook enviará status de criação de acesso ao Dashboard para envio via WhatsApp
            </p>
            <p>
              <strong>4. Testar com 5 alunos:</strong> Valide o fluxo completo antes de expandir para todos os 182
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}