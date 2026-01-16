import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { BookOpen, LogIn } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">inFlux</h1>
          </div>
          <p className="text-muted-foreground">Assistentes Pessoais de Aprendizagem</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Bem-vindo</CardTitle>
            <CardDescription>
              Faça login para acessar sua plataforma de aprendizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Você será redirecionado para autenticação segura via Manus OAuth.
              </p>
              <Button
                asChild
                className="w-full bg-primary hover:bg-primary/90 text-white"
                size="lg"
              >
                <a href={getLoginUrl()}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Fazer Login
                </a>
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground text-center mb-4">
                Roles disponíveis:
              </p>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-semibold text-foreground">Aluno:</span>
                  <p className="text-xs text-muted-foreground">
                    Acesso ao chat com IA, exercícios e simuladores
                  </p>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-foreground">Administrador:</span>
                  <p className="text-xs text-muted-foreground">
                    Visualização de desempenho e gestão de alunos
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Plataforma de Ensino de Inglês com IA baseada na Metodologia inFlux
        </p>
      </div>
    </div>
  );
}
