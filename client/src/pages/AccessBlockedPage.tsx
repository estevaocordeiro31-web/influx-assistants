import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, Sparkles } from "lucide-react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function AccessBlockedPage() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [studentName, setStudentName] = useState<string>("Aluno");

  useEffect(() => {
    // Tentar obter nome do aluno do localStorage ou sessionStorage
    const name = sessionStorage.getItem("studentName") || localStorage.getItem("studentName") || "Aluno";
    setStudentName(name);

    // Calcular tempo restante
    const calculateTimeRemaining = () => {
      const unlockDate = new Date("2026-03-01T00:00:00Z");
      const now = new Date();
      const totalMilliseconds = unlockDate.getTime() - now.getTime();

      if (totalMilliseconds <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const seconds = Math.floor((totalMilliseconds / 1000) % 60);
      const minutes = Math.floor((totalMilliseconds / (1000 * 60)) % 60);
      const hours = Math.floor((totalMilliseconds / (1000 * 60 * 60)) % 24);
      const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();

    // Atualizar a cada segundo
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-2xl">
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Sparkles className="w-16 h-16 text-indigo-600 animate-pulse" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Algo muito especial está chegando!
              </h1>
              <p className="text-lg text-gray-600">{studentName}, preparamos uma surpresa para você</p>
            </div>

            {/* Message */}
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-800 font-semibold mb-2">Estamos nos preparando para trazer uma forma completamente nova de você enxergar a escola.</p>
                  <p className="text-gray-700">
                    Vamos revolucionar a forma como você aprende inglês com inFlux. Fique atento! 🎉
                  </p>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg p-8 text-white mb-8">
              <p className="text-center text-sm font-semibold opacity-90 mb-4">Acesso liberado em:</p>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">{String(timeRemaining.days).padStart(2, "0")}</div>
                  <p className="text-sm opacity-90">Dias</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">{String(timeRemaining.hours).padStart(2, "0")}</div>
                  <p className="text-sm opacity-90">Horas</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">{String(timeRemaining.minutes).padStart(2, "0")}</div>
                  <p className="text-sm opacity-90">Minutos</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">{String(timeRemaining.seconds).padStart(2, "0")}</div>
                  <p className="text-sm opacity-90">Segundos</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4 text-center">
              <p className="text-gray-700">
                <span className="font-semibold">01 de março de 2026</span> - Data de lançamento
              </p>
              <p className="text-sm text-gray-600">
                Prepare-se para uma experiência de aprendizado totalmente transformada. Você será notificado assim que o acesso for liberado!
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                © 2026 inFlux Personal Tutor. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
