import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CreateTiagoUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "tiago.laerte@icloud.com",
    name: "Tiago Laerte Marques",
    phone: "11920409000",
    currentLevel: "elementary" as const,
    objective: "career" as const,
    profession: "Médico",
  });

  const createUserMutation = trpc.userManagement.createSpecialUser.useMutation();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleCreate = async () => {
    try {
      setResult(null);
      const response = await createUserMutation.mutateAsync({
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        currentLevel: formData.currentLevel,
        objective: formData.objective,
        profession: formData.profession,
      });

      setResult({
        success: true,
        message: `✅ Usuário criado com sucesso! ID: ${response.user.id}`,
      });

      // Limpar formulário após sucesso
      setTimeout(() => {
        setIsOpen(false);
        setResult(null);
      }, 2000);
    } catch (error) {
      setResult({
        success: false,
        message: `❌ Erro ao criar usuário: ${error instanceof Error ? error.message : "Desconhecido"}`,
      });
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Criar Usuário Tiago
      </Button>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 max-w-md">
      <CardHeader>
        <CardTitle className="text-white">Criar Usuário Tiago</CardTitle>
        <CardDescription className="text-slate-400">
          Preencha os dados para criar o acesso personalizado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email */}
        <div>
          <label className="text-sm text-slate-300 block mb-2">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
            disabled={createUserMutation.isPending}
          />
        </div>

        {/* Nome */}
        <div>
          <label className="text-sm text-slate-300 block mb-2">Nome Completo</label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
            disabled={createUserMutation.isPending}
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="text-sm text-slate-300 block mb-2">Telefone</label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
            disabled={createUserMutation.isPending}
          />
        </div>

        {/* Nível */}
        <div>
          <label className="text-sm text-slate-300 block mb-2">Nível de Inglês</label>
          <Select
            value={formData.currentLevel}
            onValueChange={(value) => setFormData({ ...formData, currentLevel: value as any })}
            disabled={createUserMutation.isPending}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="elementary">Elementary</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="upper_intermediate">Upper-Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="proficient">Proficient</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Objetivo */}
        <div>
          <label className="text-sm text-slate-300 block mb-2">Objetivo</label>
          <Select
            value={formData.objective}
            onValueChange={(value) => setFormData({ ...formData, objective: value as any })}
            disabled={createUserMutation.isPending}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="career">Carreira Profissional</SelectItem>
              <SelectItem value="travel">Viagens</SelectItem>
              <SelectItem value="studies">Estudos</SelectItem>
              <SelectItem value="other">Aprendizado Geral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Profissão */}
        <div>
          <label className="text-sm text-slate-300 block mb-2">Profissão</label>
          <Input
            type="text"
            value={formData.profession}
            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
            disabled={createUserMutation.isPending}
          />
        </div>

        {/* Resultado */}
        {result && (
          <Alert
            className={result.success ? "bg-green-500/20 border-green-500/50" : "bg-red-500/20 border-red-500/50"}
          >
            {result.success ? (
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400" />
            )}
            <AlertDescription
              className={result.success ? "text-green-300" : "text-red-300"}
            >
              {result.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Botões */}
        <div className="flex gap-2">
          <Button
            onClick={handleCreate}
            disabled={createUserMutation.isPending}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {createUserMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar Usuário"
            )}
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            disabled={createUserMutation.isPending}
            variant="outline"
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
