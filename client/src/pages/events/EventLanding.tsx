import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Clover, Star, Users, Zap } from "lucide-react";

const LUCAS_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/lucas-nyc_a016f4f1.jpg';
const EMILY_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/emily-london_de6867d2.jpg';
const AIKO_IMG  = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663292442852/2aNFQGA4rARocXGp2d4pqb/aiko-sydney_fbb013b2.jpg';

export default function EventLanding() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [guestName, setGuestName] = useState("");
  const [guestWhatsapp, setGuestWhatsapp] = useState("");
  const [step, setStep] = useState<"landing" | "guest-form">("landing");
  const [loading, setLoading] = useState(false);

  const { data: event } = trpc.culturalEvents.getActive.useQuery();
  const joinAsGuest = trpc.culturalEvents.joinAsGuest.useMutation();
  const joinAsStudent = trpc.culturalEvents.joinAsStudent.useMutation();

  const handleStudentJoin = async () => {
    if (!event) return;
    setLoading(true);
    try {
      const result = await joinAsStudent.mutateAsync({ eventId: event.id });
      localStorage.setItem("event_participant_id", String(result.participantId));
      localStorage.setItem("event_id", event.id);
      navigate("/events/hub");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestJoin = async () => {
    if (!event || !guestName.trim()) return;
    setLoading(true);
    try {
      const result = await joinAsGuest.mutateAsync({
        eventId: event.id,
        name: guestName.trim(),
        whatsapp: guestWhatsapp.trim() || undefined,
      });
      localStorage.setItem("event_participant_id", String(result.participantId));
      localStorage.setItem("event_guest_token", result.token);
      localStorage.setItem("event_id", event.id);
      navigate("/events/hub");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0f1e" }}>
        <div className="text-center">
          <Clover size={48} className="text-green-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Carregando evento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #0d1f12 100%)" }}>
      {/* Hero */}
      <div className="relative overflow-hidden pt-12 pb-8 px-6">
        {/* Decorative shamrocks */}
        <div className="absolute top-4 left-4 text-green-400 opacity-20 text-5xl">☘</div>
        <div className="absolute top-8 right-6 text-green-400 opacity-15 text-3xl">☘</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-green-400 opacity-10 text-7xl">☘</div>

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-bold text-green-300"
            style={{ background: "rgba(45,106,79,0.3)", border: "1px solid #40916c66" }}>
            <Clover size={12} /> 21 de março • St. Patrick's Night
          </div>

          <h1 className="text-3xl font-black text-white mb-2 leading-tight">
            St. Patrick's<br />
            <span style={{ color: "#40916c" }}>Night</span> 🍀
          </h1>
          <p className="text-gray-300 text-sm max-w-xs mx-auto mb-6">
            Complete missões em inglês, ganhe pontos e dispute o ranking com alunos e convidados!
          </p>

          {/* Characters */}
          <div className="flex justify-center gap-3 mb-6">
            {[
              { img: LUCAS_IMG, name: "Lucas", flag: "🇺🇸", color: "#2196F3" },
              { img: EMILY_IMG, name: "Emily", flag: "🇬🇧", color: "#e53935" },
              { img: AIKO_IMG,  name: "Aiko",  flag: "🇦🇺", color: "#7b2d8b" },
            ].map(c => (
              <div key={c.name} className="flex flex-col items-center gap-1">
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-16 h-16 rounded-full object-cover border-2 shadow-lg"
                  style={{ borderColor: c.color }}
                />
                <span className="text-xs text-white font-semibold">{c.name} {c.flag}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">5</div>
              <div className="text-xs text-gray-400">Missões</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">500</div>
              <div className="text-xs text-gray-400">Pts máx</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">🏆</div>
              <div className="text-xs text-gray-400">Ranking</div>
            </div>
          </div>
        </div>
      </div>

      {/* Join section */}
      <div className="flex-1 px-6 pb-10">
        {step === "landing" ? (
          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            {isAuthenticated ? (
              <>
                <div className="rounded-2xl p-4 mb-2 text-center"
                  style={{ background: "rgba(45,106,79,0.2)", border: "1px solid #40916c44" }}>
                  <p className="text-sm text-gray-300">Bem-vindo, <span className="text-green-400 font-bold">{user?.name?.split(' ')[0]}</span>!</p>
                  <p className="text-xs text-gray-500 mt-1">Entre como aluno inFlux e acumule pontos extras</p>
                </div>
                <Button
                  onClick={handleStudentJoin}
                  disabled={loading}
                  className="w-full h-12 text-base font-bold rounded-xl"
                  style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}
                >
                  {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Zap size={18} className="mr-2" />}
                  Entrar como Aluno inFlux
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep("guest-form")}
                  className="w-full h-12 text-sm rounded-xl border-gray-600 text-gray-300"
                >
                  <Users size={16} className="mr-2" />
                  Entrar como Convidado
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setStep("guest-form")}
                  className="w-full h-14 text-base font-bold rounded-xl"
                  style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}
                >
                  <Clover size={20} className="mr-2" />
                  Participar do Evento
                </Button>
                <p className="text-center text-xs text-gray-500">
                  Aluno inFlux?{" "}
                  <a href="/login" className="text-green-400 underline">Faça login</a>{" "}
                  para ganhar pontos extras
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="max-w-sm mx-auto">
            <button onClick={() => setStep("landing")} className="text-gray-400 text-sm mb-4 flex items-center gap-1">
              ← Voltar
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Criar seu perfil</h2>
            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-gray-300 text-sm mb-1 block">Seu nome *</Label>
                <Input
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="Como você se chama?"
                  className="bg-gray-800 border-gray-600 text-white"
                  maxLength={60}
                />
              </div>
              <div>
                <Label className="text-gray-300 text-sm mb-1 block">WhatsApp (opcional)</Label>
                <Input
                  value={guestWhatsapp}
                  onChange={e => setGuestWhatsapp(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="bg-gray-800 border-gray-600 text-white"
                  type="tel"
                />
                <p className="text-xs text-gray-500 mt-1">Para receber seu resultado e conhecer mais sobre a inFlux</p>
              </div>
              <Button
                onClick={handleGuestJoin}
                disabled={loading || !guestName.trim()}
                className="w-full h-12 text-base font-bold rounded-xl mt-2"
                style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}
              >
                {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Star size={18} className="mr-2" />}
                Começar as Missões!
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
