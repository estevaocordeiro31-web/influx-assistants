import { QRCodeSVG } from "qrcode.react";
import { Heart, Utensils, Star, Clock, Ticket } from "lucide-react";
import { CHARACTER_IMAGES, HERO_BANNER } from "@/data/valentines/chunks";

const ACTIVITY_URL = "https://influxassist-2anfqga4.manus.space/events/valentines";
const LOGO_URL = "/logo-influx.png";

export default function ValentinesTotem() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1a0011 0%, #2d0a1e 30%, #1a0011 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Floating hearts background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(i * 8.3) % 100}%`,
              top: `${(i * 13.7) % 100}%`,
              fontSize: `${14 + (i % 4) * 8}px`,
              opacity: 0.06 + (i % 3) * 0.03,
              color: "#e91e63",
              transform: `rotate(${i * 30}deg)`,
            }}
          >
            ❤
          </div>
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "0 20px" }}>

        {/* ── HEADER / LOGO ── */}
        <div style={{ textAlign: "center", paddingTop: 40 }}>
          <img
            src={LOGO_URL}
            alt="inFlux"
            style={{ height: 48, margin: "0 auto 12px", objectFit: "contain" }}
          />
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 16px", borderRadius: 20,
            background: "rgba(233,30,99,0.15)", border: "1px solid rgba(233,30,99,0.3)",
          }}>
            <Heart size={14} style={{ color: "#e91e63" }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#f48fb1", letterSpacing: "0.05em" }}>
              VALENTINE'S DAY SPECIAL
            </span>
          </div>
        </div>

        {/* ── HERO BANNER ── */}
        <div style={{ marginTop: 24, borderRadius: 20, overflow: "hidden", position: "relative" }}>
          <img
            src={HERO_BANNER}
            alt="Valentine's Restaurant"
            style={{ width: "100%", height: 200, objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(26,0,17,0.95))",
            padding: "40px 20px 16px",
          }}>
            <h1 style={{
              fontSize: "1.6rem", fontWeight: 900, color: "#fff",
              margin: 0, lineHeight: 1.1,
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}>
              inFlux Restaurant
            </h1>
            <p style={{ fontSize: "0.75rem", color: "#f48fb1", margin: "4px 0 0", fontWeight: 600 }}>
              Valentine's Day Edition
            </p>
          </div>
        </div>

        {/* ── CHARACTERS ── */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 12, marginTop: 20,
        }}>
          {[
            { name: "Lucas", role: "Chef", flag: "🇺🇸", img: CHARACTER_IMAGES.lucas.adult, color: "#e53935" },
            { name: "Emily", role: "Sommelier", flag: "🇬🇧", img: CHARACTER_IMAGES.emily.adult, color: "#880E4F" },
            { name: "Aiko", role: "Barista", flag: "🇦🇺", img: CHARACTER_IMAGES.aiko.adult, color: "#FF6F00" },
          ].map(c => (
            <div key={c.name} style={{ textAlign: "center" }}>
              <img
                src={c.img}
                alt={c.name}
                style={{
                  width: 72, height: 72, borderRadius: "50%",
                  objectFit: "cover", border: `3px solid ${c.color}`,
                  boxShadow: `0 0 16px ${c.color}44`,
                }}
              />
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#fff", margin: "6px 0 0" }}>
                {c.name} {c.flag}
              </p>
              <p style={{ fontSize: "0.55rem", color: "#f48fb1", margin: 0 }}>{c.role}</p>
            </div>
          ))}
        </div>

        {/* ── DESCRIPTION ── */}
        <div style={{
          marginTop: 24, padding: "16px 20px", borderRadius: 16,
          background: "rgba(233,30,99,0.08)", border: "1px solid rgba(233,30,99,0.2)",
        }}>
          <p style={{ fontSize: "0.8rem", color: "#fff", fontWeight: 600, margin: "0 0 8px", textAlign: "center" }}>
            Pratique inglês no restaurante!
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {[
              { icon: <Utensils size={12} />, label: "Food Challenge com IA" },
              { icon: <Star size={12} />, label: "Quiz Cultural" },
              { icon: <Heart size={12} />, label: "Vocabulário Romântico" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "4px 10px", borderRadius: 12,
                background: "rgba(255,255,255,0.06)",
                fontSize: "0.6rem", color: "#f48fb1", fontWeight: 500,
              }}>
                {item.icon}
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── QR CODE SECTION ── */}
        <div style={{
          marginTop: 28, textAlign: "center",
          padding: "28px 20px", borderRadius: 20,
          background: "linear-gradient(135deg, rgba(233,30,99,0.12), rgba(255,82,82,0.06))",
          border: "2px solid rgba(233,30,99,0.25)",
        }}>
          <p style={{
            fontSize: "0.9rem", fontWeight: 800, color: "#fff",
            margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            Escaneie e participe!
          </p>
          <p style={{ fontSize: "0.65rem", color: "#f48fb1", margin: "0 0 20px" }}>
            Aponte a câmera do celular para o QR Code
          </p>

          <div style={{
            display: "inline-block", padding: 16, borderRadius: 16,
            background: "#fff", boxShadow: "0 0 30px rgba(233,30,99,0.3)",
          }}>
            <QRCodeSVG
              value={ACTIVITY_URL}
              size={200}
              level="H"
              bgColor="#ffffff"
              fgColor="#1a0011"
              imageSettings={{
                src: "/logo-influx.png",
                x: undefined,
                y: undefined,
                height: 36,
                width: 36,
                excavate: true,
              }}
            />
          </div>

          <p style={{
            fontSize: "0.55rem", color: "rgba(244,143,177,0.6)", margin: "16px 0 0",
            wordBreak: "break-all",
          }}>
            {ACTIVITY_URL}
          </p>
        </div>

        {/* ── COMPETITION BANNER ── */}
        <div style={{
          marginTop: 24, padding: "16px 20px", borderRadius: 16,
          background: "linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,152,0,0.06))",
          border: "1px solid rgba(255,215,0,0.25)",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "1rem", margin: "0 0 4px" }}>🏆</p>
          <p style={{ fontSize: "0.8rem", fontWeight: 800, color: "#ffd700", margin: "0 0 4px" }}>
            Competição entre alunos!
          </p>
          <p style={{ fontSize: "0.65rem", color: "#ffcc80", margin: 0 }}>
            Complete as missões, ganhe pontos e dispute o ranking com seus colegas!
          </p>
        </div>

        {/* ── CONVITES - EM BREVE ── */}
        <div style={{
          marginTop: 24, marginBottom: 40, padding: "24px 20px", borderRadius: 20,
          background: "rgba(255,255,255,0.03)",
          border: "1.5px dashed rgba(233,30,99,0.3)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Blur overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            background: "rgba(26,0,17,0.3)",
            zIndex: 1,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              padding: "8px 24px", borderRadius: 12,
              background: "rgba(233,30,99,0.2)", border: "1px solid rgba(233,30,99,0.4)",
            }}>
              <Clock size={18} style={{ color: "#f48fb1", marginBottom: 4 }} />
              <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fff", margin: 0 }}>
                Em breve
              </p>
              <p style={{ fontSize: "0.6rem", color: "#f48fb1", margin: "4px 0 0" }}>
                Fique ligado!
              </p>
            </div>
          </div>

          {/* Content behind blur */}
          <div style={{ opacity: 0.4 }}>
            <Ticket size={32} style={{ color: "#e91e63", marginBottom: 8 }} />
            <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
              Valentine's Day Dinner
            </p>
            <p style={{ fontSize: "0.7rem", color: "#f48fb1", margin: "0 0 12px" }}>
              Garanta seu convite para a noite especial!
            </p>
            <div style={{
              display: "flex", justifyContent: "center", gap: 16,
            }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "0.6rem", color: "#888", margin: 0 }}>Data</p>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff", margin: 0 }}>14 de Fev</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "0.6rem", color: "#888", margin: 0 }}>Horário</p>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff", margin: 0 }}>19h</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "0.6rem", color: "#888", margin: 0 }}>Convite</p>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff", margin: 0 }}>R$ --</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ textAlign: "center", paddingBottom: 30 }}>
          <p style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.2)" }}>
            powered by inFlux English School
          </p>
        </div>

      </div>
    </div>
  );
}
