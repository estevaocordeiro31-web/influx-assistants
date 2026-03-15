import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const tempColor = (t: number) => {
  if (t >= 9) return "text-red-500 font-bold";
  if (t >= 7) return "text-orange-500 font-bold";
  if (t >= 5) return "text-yellow-500";
  return "text-gray-400";
};

const tempEmoji = (t: number) => {
  if (t >= 9) return "🔥";
  if (t >= 7) return "⭐";
  if (t >= 5) return "🟡";
  return "❄️";
};

export default function MineracaoHistoricoPage() {
  const [minTemp, setMinTemp] = useState(7);

  const { data: progress, refetch: refetchProgress } = trpc.historicoMiner.getProgress.useQuery(undefined, {
    refetchInterval: 3000, // atualiza a cada 3s quando rodando
  });

  const { data: hotLeads } = trpc.historicoMiner.getHotLeads.useQuery(
    { minTemp },
    { refetchInterval: 10000 }
  );

  const startMutation = trpc.historicoMiner.startMining.useMutation({
    onSuccess: () => refetchProgress(),
  });

  const pauseMutation = trpc.historicoMiner.pauseMining.useMutation({
    onSuccess: () => refetchProgress(),
  });

  const resetMutation = trpc.historicoMiner.resetMining.useMutation({
    onSuccess: () => refetchProgress(),
  });

  const isRunning = progress?.isRunning ?? false;
  const isPaused = progress?.isPaused ?? false;
  const status = progress?.status ?? "idle";
  const percentual = progress?.percentual ?? 0;

  const statusLabel: Record<string, string> = {
    idle: "Aguardando",
    running: "Minerando...",
    paused: "Pausado",
    completed: "Concluído",
    error: "Erro",
  };

  const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    idle: "outline",
    running: "default",
    paused: "secondary",
    completed: "default",
    error: "destructive",
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">⛏️ Mineração do Histórico</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Celular do Retiro · (11) 95766-7482 · Últimos 12 meses
          </p>
        </div>
        <Badge variant={statusVariant[status] ?? "outline"}>
          {statusLabel[status] ?? status}
        </Badge>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Controles</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Button
            onClick={() => startMutation.mutate()}
            disabled={isRunning || startMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {startMutation.isPending ? "Iniciando..." : "▶ Iniciar Mineração"}
          </Button>
          <Button
            variant="outline"
            onClick={() => pauseMutation.mutate()}
            disabled={!isRunning || pauseMutation.isPending}
          >
            ⏸ Pausar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Resetar todo o progresso? Isso apagará todos os dados minerados.")) {
                resetMutation.mutate();
              }
            }}
            disabled={isRunning || resetMutation.isPending}
          >
            🗑 Resetar
          </Button>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      {(isRunning || status === "completed" || status === "paused") && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex justify-between">
              <span>Progresso</span>
              <span className="text-muted-foreground font-normal">
                {progress?.processados ?? 0} / {progress?.totalChats ?? 0} conversas
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={percentual} className="h-3" />
            <p className="text-sm text-muted-foreground text-right">{percentual}% concluído</p>
          </CardContent>
        </Card>
      )}

      {/* Contadores */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total de Chats", value: progress?.totalChats ?? 0, icon: "💬" },
          { label: "Processados", value: progress?.processados ?? 0, icon: "✅" },
          { label: "Novos Contatos", value: progress?.novosContatos ?? 0, icon: "👤" },
          { label: "Atualizados", value: progress?.contatosAtualizados ?? 0, icon: "🔄" },
          { label: "Follows Criados", value: progress?.followsCriados ?? 0, icon: "📋" },
          { label: "Leads Quentes", value: progress?.leadsQuentes ?? 0, icon: "🔥" },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-4 pb-3 text-center">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-2xl font-bold text-foreground">{item.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabela de Leads Quentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>🔥 Leads Quentes</span>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-normal text-muted-foreground">Temperatura mínima:</span>
              {[5, 7, 9].map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={minTemp === t ? "default" : "outline"}
                  onClick={() => setMinTemp(t)}
                  className="h-7 px-2 text-xs"
                >
                  ≥{t}
                </Button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hotLeads || hotLeads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-3">⛏️</div>
              <p className="text-sm">
                {status === "idle"
                  ? "Inicie a mineração para ver os leads quentes"
                  : "Nenhum lead encontrado com essa temperatura"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 pr-4">Temp.</th>
                    <th className="text-left py-2 pr-4">Nome</th>
                    <th className="text-left py-2 pr-4">Telefone</th>
                    <th className="text-left py-2 pr-4">Interesse</th>
                    <th className="text-left py-2 pr-4">Status</th>
                    <th className="text-left py-2">Melhor Abordagem</th>
                  </tr>
                </thead>
                <tbody>
                  {hotLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-2 pr-4">
                        <span className={tempColor(lead.temperatura ?? 0)}>
                          {tempEmoji(lead.temperatura ?? 0)} {lead.temperatura}
                        </span>
                      </td>
                      <td className="py-2 pr-4 font-medium">{lead.nome ?? "—"}</td>
                      <td className="py-2 pr-4 text-muted-foreground font-mono text-xs">
                        {lead.phone}
                      </td>
                      <td className="py-2 pr-4">
                        {lead.interesse ? (
                          <Badge variant="outline" className="text-xs">{lead.interesse}</Badge>
                        ) : "—"}
                      </td>
                      <td className="py-2 pr-4">
                        <Badge
                          variant={
                            lead.leadStatus === "interessado" ? "default" :
                            lead.leadStatus === "ex_aluno" ? "secondary" : "outline"
                          }
                          className="text-xs"
                        >
                          {lead.leadStatus ?? "—"}
                        </Badge>
                      </td>
                      <td className="py-2 text-xs text-muted-foreground max-w-xs">
                        {lead.melhorAbordagem ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo final quando concluído */}
      {status === "completed" && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="pt-4">
            <h3 className="font-semibold text-green-600 mb-2">✅ Mineração Concluída!</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Total de conversas analisadas: <strong>{progress?.totalChats}</strong></p>
              <p>Novos contatos criados: <strong>{progress?.novosContatos}</strong></p>
              <p>Leads quentes identificados (≥7): <strong>{progress?.leadsQuentes}</strong></p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
