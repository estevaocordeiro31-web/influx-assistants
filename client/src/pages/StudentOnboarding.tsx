/**
 * StudentOnboarding — Elie introduces herself to a new student
 * 4 steps: Welcome → Name/Age → Level/Interests → Ready!
 * Saves profile via studentProfile.updateDetailedProfile
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { ElieCompanion } from "@/components/tutor/ElieCompanion";
import { useAgeAdaptive, type AgeGroup } from "@/contexts/AgeAdaptiveContext";
import { AgeAdaptiveProvider } from "@/contexts/AgeAdaptiveContext";
import { trpc } from "@/lib/trpc";
import "@/styles/tutor-theme.css";

type Step = 0 | 1 | 2 | 3;

interface StudentData {
  name: string;
  age: number | null;
  level: string;
  interests: string;
  phone: string;
}

function OnboardingInner() {
  const [step, setStep] = useState<Step>(0);
  const [data, setData] = useState<StudentData>({
    name: "",
    age: null,
    level: "",
    interests: "",
    phone: "",
  });
  const [, navigate] = useLocation();
  const config = useAgeAdaptive();

  const updateProfile = trpc.studentProfile.updateProfile.useMutation({
    onSuccess: () => {
      localStorage.setItem("imaind_student_onboarded", "true");
      localStorage.setItem("imaind_student_name", data.name);
      if (data.age) localStorage.setItem("imaind_student_age", String(data.age));
      navigate("/student/home");
    },
    onError: () => {
      // Save locally even if API fails
      localStorage.setItem("imaind_student_onboarded", "true");
      localStorage.setItem("imaind_student_name", data.name);
      if (data.age) localStorage.setItem("imaind_student_age", String(data.age));
      navigate("/student/home");
    },
  });

  function next() {
    if (step < 3) {
      setStep((s) => (s + 1) as Step);
    } else {
      // Save and go
      updateProfile.mutate({
        learning_goal: [data.level, data.interests].filter(Boolean).join(" | ") || undefined,
      });
    }
  }

  const ageGroup: AgeGroup = !data.age ? "adult" : data.age <= 12 ? "child" : data.age <= 17 ? "teen" : "adult";

  return (
    <div
      className={`tutor-app ${ageGroup === "teen" ? "dark" : ""}`}
      data-age={ageGroup}
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        background:
          ageGroup === "teen"
            ? "linear-gradient(135deg, #0c1222 0%, #1a2744 100%)"
            : ageGroup === "child"
            ? "linear-gradient(135deg, #e0f2fe 0%, #dbeafe 50%, #e0e7ff 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        fontFamily: "'Outfit', sans-serif",
        transition: "background 0.5s",
      }}
    >
      {/* Elie */}
      <div style={{ marginBottom: 32 }}>
        <ElieCompanion
          state={step === 0 ? "greeting" : step === 3 ? "greeting" : "talking"}
          size="full"
        />
      </div>

      {/* Steps */}
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        {step === 0 && (
          <div style={{ animation: "imaind-text-reveal 0.5s ease-out" }}>
            <h1
              style={{
                fontSize: "var(--tutor-text-2xl)",
                fontWeight: 600,
                color: "var(--tutor-text)",
                marginBottom: 12,
              }}
            >
              {ageGroup === "child" ? "Oi! Eu sou a Elie! 🎉" : "Oi! Eu sou a Elie!"}
            </h1>
            <p
              style={{
                fontSize: "var(--tutor-text-base)",
                color: "var(--tutor-text-secondary)",
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              {ageGroup === "child"
                ? "Vou ser sua melhor amiga no ingles! A gente vai aprender juntinhas, que tal? 🌟"
                : ageGroup === "teen"
                ? "Sou sua parceira de ingles aqui na inFlux. Bora fazer isso funcionar?"
                : "Sou sua coordenadora pedagogica virtual na inFlux. Estou aqui para te ajudar a evoluir no ingles!"}
            </p>
            <button className="tutor-btn tutor-btn-primary" onClick={next} style={{ width: "100%" }}>
              {ageGroup === "child" ? "Bora! 🚀" : "Vamos comecar"}
            </button>
          </div>
        )}

        {step === 1 && (
          <div style={{ animation: "imaind-text-reveal 0.5s ease-out" }}>
            <h2
              style={{
                fontSize: "var(--tutor-text-xl)",
                fontWeight: 600,
                color: "var(--tutor-text)",
                marginBottom: 8,
              }}
            >
              Como posso te chamar?
            </h2>
            <p style={{ fontSize: "var(--tutor-text-sm)", color: "var(--tutor-text-muted)", marginBottom: 24 }}>
              E quantos anos voce tem?
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              <input
                className="tutor-input"
                placeholder="Seu nome ou apelido"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                autoFocus
              />
              <input
                className="tutor-input"
                type="number"
                placeholder="Sua idade"
                min={4}
                max={80}
                value={data.age ?? ""}
                onChange={(e) => setData({ ...data, age: e.target.value ? Number(e.target.value) : null })}
              />
            </div>

            <button
              className="tutor-btn tutor-btn-primary"
              onClick={next}
              disabled={!data.name.trim()}
              style={{ width: "100%", opacity: data.name.trim() ? 1 : 0.5 }}
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: "imaind-text-reveal 0.5s ease-out" }}>
            <h2
              style={{
                fontSize: "var(--tutor-text-xl)",
                fontWeight: 600,
                color: "var(--tutor-text)",
                marginBottom: 8,
              }}
            >
              {ageGroup === "child"
                ? `Legal, ${data.name}! 🌈`
                : `Prazer, ${data.name}!`}
            </h2>
            <p style={{ fontSize: "var(--tutor-text-sm)", color: "var(--tutor-text-muted)", marginBottom: 24 }}>
              Me conta um pouco sobre voce no ingles
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              <select
                className="tutor-input"
                value={data.level}
                onChange={(e) => setData({ ...data, level: e.target.value })}
              >
                <option value="">Seu nivel no ingles...</option>
                <option value="beginner">Iniciante (Basic)</option>
                <option value="elementary">Elementar (Book 1-2)</option>
                <option value="pre-intermediate">Pre-intermediario (Book 3-4)</option>
                <option value="intermediate">Intermediario (Book 5-6)</option>
                <option value="upper-intermediate">Avancado (Book 7+)</option>
              </select>
            </div>

            {/* Interest chips */}
            <p style={{ fontSize: "var(--tutor-text-sm)", color: "var(--tutor-text-muted)", marginBottom: 12, textAlign: "left" }}>
              O que voce gosta?
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {(ageGroup === "child"
                ? ["Jogos 🎮", "Musica 🎵", "Desenhos 🎨", "Esportes ⚽", "Animais 🐶", "Super-herois 🦸"]
                : ageGroup === "teen"
                ? ["Games 🎮", "Musica 🎵", "Series 📺", "Esportes ⚽", "Redes Sociais 📱", "Viagens ✈️"]
                : ["Negocios 💼", "Viagens ✈️", "Tecnologia 💻", "Cultura 🎭", "Carreira 📈", "Filmes 🎬"]
              ).map((interest) => {
                const isSelected = data.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    className="tutor-chip"
                    onClick={() => {
                      if (isSelected) {
                        setData({ ...data, interests: data.interests.replace(interest + ", ", "").replace(interest, "") });
                      } else {
                        setData({ ...data, interests: data.interests ? data.interests + ", " + interest : interest });
                      }
                    }}
                    style={{
                      borderColor: isSelected ? "var(--imaind-blue)" : undefined,
                      background: isSelected ? "rgba(26,111,219,0.08)" : undefined,
                      color: isSelected ? "var(--imaind-blue)" : undefined,
                    }}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>

            <button className="tutor-btn tutor-btn-primary" onClick={next} style={{ width: "100%" }}>
              Continuar
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: "imaind-text-reveal 0.5s ease-out" }}>
            <h2
              style={{
                fontSize: "var(--tutor-text-2xl)",
                fontWeight: 600,
                color: "var(--tutor-text)",
                marginBottom: 12,
              }}
            >
              {ageGroup === "child"
                ? `Tudo pronto, ${data.name}! 🎉🎉🎉`
                : ageGroup === "teen"
                ? `Show, ${data.name}! Bora la 🔥`
                : `Pronto, ${data.name}!`}
            </h2>
            <p
              style={{
                fontSize: "var(--tutor-text-base)",
                color: "var(--tutor-text-secondary)",
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              {ageGroup === "child"
                ? "Agora a gente vai aprender ingles juntas! Pode me chamar sempre que quiser, ta? 💙"
                : ageGroup === "teen"
                ? "Pode me chamar a qualquer hora. To aqui pra te ajudar no que precisar."
                : "Estarei sempre disponivel para ajudar com duvidas, pratica de conversacao e acompanhamento do seu progresso."}
            </p>
            <button
              className="tutor-btn tutor-btn-primary"
              onClick={next}
              disabled={updateProfile.isPending}
              style={{ width: "100%" }}
            >
              {updateProfile.isPending ? "Salvando..." : ageGroup === "child" ? "Vamos! 🚀" : "Comecar"}
            </button>
          </div>
        )}

        {/* Step indicators */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 24,
          }}
        >
          {[0, 1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                width: s === step ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: s === step ? "var(--imaind-blue, #1a6fdb)" : "var(--tutor-border, #e2e8f0)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StudentOnboarding() {
  return (
    <AgeAdaptiveProvider age={null}>
      <OnboardingInner />
    </AgeAdaptiveProvider>
  );
}
