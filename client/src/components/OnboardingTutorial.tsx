import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageCircle, Zap, BookOpen, Trophy, 
  ChevronRight, ChevronLeft, X, Sparkles,
  Target, Users, Flame
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  features: string[];
  image?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Bem-vindo ao inFlux Personal Tutor! 🎉",
    description: "Seu assistente de IA personalizado para acelerar seu aprendizado de inglês",
    icon: <Sparkles className="w-12 h-12" />,
    color: "text-green-400",
    gradient: "from-green-400 to-green-500",
    features: [
      "Prática personalizada baseada no seu nível",
      "Disponível 24/7 para tirar dúvidas",
      "Acompanhamento do seu progresso em tempo real",
      "Conteúdo adaptado aos seus interesses"
    ],
  },
  {
    id: "chat",
    title: "Chat IA - Seu Tutor Pessoal 💬",
    description: "Converse em inglês a qualquer hora, tire dúvidas e pratique conversação",
    icon: <MessageCircle className="w-12 h-12" />,
    color: "text-blue-400",
    gradient: "from-blue-400 to-blue-500",
    features: [
      "Conversação natural em inglês",
      "Correção instantânea de erros",
      "Explicações detalhadas de gramática",
      "Sugestões de vocabulário contextual",
      "Chat por voz disponível"
    ],
  },
  {
    id: "exercises",
    title: "Exercícios Personalizados ⚡",
    description: "Pratique chunks, vocabulário e gramática do seu nível atual",
    icon: <Zap className="w-12 h-12" />,
    color: "text-yellow-400",
    gradient: "from-yellow-400 to-yellow-500",
    features: [
      "Exercícios adaptados ao seu Book",
      "Prática de chunks e expressões reais",
      "Feedback imediato",
      "Simulação de situações do dia a dia",
      "Acompanhamento de acertos"
    ],
  },
  {
    id: "blog",
    title: "Dicas do Blog inFlux 📚",
    description: "Receba dicas personalizadas do blog da inFlux baseadas nas suas dificuldades",
    icon: <BookOpen className="w-12 h-12" />,
    color: "text-purple-400",
    gradient: "from-purple-400 to-purple-500",
    features: [
      "Dica do dia personalizada",
      "Recomendações baseadas em suas dificuldades",
      "Artigos sobre pronúncia e connected speech",
      "Dicas de músicas e séries para praticar",
      "Salve suas dicas favoritas"
    ],
  },
  {
    id: "reading-club",
    title: "Reading Club 📖",
    description: "Participe do clube de leitura, compartilhe descobertas e ganhe recompensas",
    icon: <Users className="w-12 h-12" />,
    color: "text-orange-400",
    gradient: "from-orange-400 to-orange-500",
    features: [
      "Compartilhe expressões e trechos interessantes",
      "Interaja com outros alunos",
      "Ganhe badges por participação",
      "Troque badges por influxcoins",
      "Encontros presenciais especiais"
    ],
  },
  {
    id: "progress",
    title: "Acompanhe seu Progresso 📊",
    description: "Veja suas estatísticas, conquistas e evolução ao longo do tempo",
    icon: <Trophy className="w-12 h-12" />,
    color: "text-green-400",
    gradient: "from-green-400 to-green-500",
    features: [
      "Horas de estudo acumuladas",
      "Chunks aprendidos",
      "Sequência de dias (streak)",
      "Badges e conquistas",
      "Histórico de livros completados"
    ],
  },
];

interface OnboardingTutorialProps {
  onComplete: () => void;
}

export function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const step = ONBOARDING_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsOpen(false);
    onComplete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className={cn("text-2xl font-bold flex items-center gap-3", step.color)}>
              {step.icon}
              {step.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <DialogDescription className="text-slate-300 text-base mt-2">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Indicador de progresso */}
          <div className="flex gap-2 justify-center">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentStep 
                    ? `w-8 bg-gradient-to-r ${step.gradient}` 
                    : "w-2 bg-slate-700"
                )}
              />
            ))}
          </div>

          {/* Card com features */}
          <Card className={cn(
            "bg-gradient-to-br border-2 shadow-lg",
            `${step.gradient} bg-opacity-10`,
            "border-slate-700"
          )}>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {step.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      `bg-gradient-to-br ${step.gradient}`
                    )}>
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-slate-200 text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Imagem do Fluxie (se disponível) */}
          {currentStep === 0 && (
            <div className="flex justify-center">
              <img 
                src="/miss-elie-uniform-teaching.png" 
                alt="Fluxie" 
                className="w-32 h-32 object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          )}
        </div>

        {/* Navegação */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="text-slate-400 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>

          <div className="text-slate-400 text-sm">
            {currentStep + 1} de {ONBOARDING_STEPS.length}
          </div>

          <Button
            onClick={handleNext}
            className={cn(
              "font-bold text-white shadow-lg",
              `bg-gradient-to-r ${step.gradient}`,
              `hover:shadow-xl transition-all duration-200`
            )}
          >
            {isLastStep ? (
              <>
                Começar!
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Próximo
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {/* Link para pular */}
        {!isLastStep && (
          <div className="text-center">
            <button
              onClick={handleSkip}
              className="text-slate-400 hover:text-slate-300 text-sm underline"
            >
              Pular tutorial
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
