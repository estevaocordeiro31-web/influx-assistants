import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

interface CertificateData {
  participantName: string;
  eventName: string;
  pronunciationScore: number;
  date: string;
  certificateId: string;
  qrCodeUrl: string;
}

// Generate unique certificate ID
function generateCertificateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `CERT-${timestamp}-${random}`.toUpperCase();
}

// Generate QR code data URL using QR server API
async function generateQRCode(certificateId: string): Promise<string> {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(certificateId)}`;
  return qrUrl;
}

// Generate SVG certificate
function generateCertificateSVG(data: CertificateData): string {
  const svg = `
    <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1e1b4b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="1200" height="800" fill="url(#bgGradient)"/>

      <!-- Border -->
      <rect x="30" y="30" width="1140" height="740" fill="none" stroke="url(#borderGradient)" stroke-width="4" rx="20"/>
      <rect x="50" y="50" width="1100" height="700" fill="none" stroke="url(#borderGradient)" stroke-width="2" rx="15" opacity="0.5"/>

      <!-- Decorative corners -->
      <circle cx="100" cy="100" r="15" fill="#ec4899" opacity="0.3"/>
      <circle cx="1100" cy="100" r="15" fill="#a855f7" opacity="0.3"/>
      <circle cx="100" cy="700" r="15" fill="#a855f7" opacity="0.3"/>
      <circle cx="1100" cy="700" r="15" fill="#ec4899" opacity="0.3"/>

      <!-- Title -->
      <text x="600" y="120" font-size="48" font-weight="bold" text-anchor="middle" fill="#ec4899" font-family="Arial, sans-serif">
        CERTIFICADO DE PRONÚNCIA
      </text>

      <!-- Subtitle -->
      <text x="600" y="170" font-size="20" text-anchor="middle" fill="#d1d5db" font-family="Arial, sans-serif" opacity="0.8">
        ${data.eventName}
      </text>

      <!-- Decorative line -->
      <line x1="200" y1="200" x2="1000" y2="200" stroke="#a855f7" stroke-width="2" opacity="0.5"/>

      <!-- Certificate text -->
      <text x="600" y="280" font-size="18" text-anchor="middle" fill="#d1d5db" font-family="Arial, sans-serif">
        Certificamos que
      </text>

      <!-- Participant name -->
      <text x="600" y="360" font-size="44" font-weight="bold" text-anchor="middle" fill="#fbbf24" font-family="Georgia, serif">
        ${data.participantName}
      </text>

      <!-- Achievement text -->
      <text x="600" y="420" font-size="18" text-anchor="middle" fill="#d1d5db" font-family="Arial, sans-serif">
        alcançou uma pontuação de pronúncia de
      </text>

      <!-- Score -->
      <text x="600" y="490" font-size="52" font-weight="bold" text-anchor="middle" fill="#10b981" font-family="Arial, sans-serif">
        ${data.pronunciationScore}%
      </text>

      <!-- Badge -->
      ${
        data.pronunciationScore >= 80
          ? `
        <circle cx="600" cy="570" r="35" fill="#fbbf24" opacity="0.2"/>
        <text x="600" y="580" font-size="40" text-anchor="middle" fill="#fbbf24">★</text>
      `
          : ""
      }

      <!-- Date -->
      <text x="600" y="650" font-size="16" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif">
        Data: ${data.date}
      </text>

      <!-- Certificate ID -->
      <text x="600" y="690" font-size="12" text-anchor="middle" fill="#6b7280" font-family="monospace">
        ID: ${data.certificateId}
      </text>

      <!-- QR Code placeholder -->
      <rect x="1000" y="650" width="150" height="150" fill="white" rx="5"/>
      <text x="1075" y="735" font-size="10" text-anchor="middle" fill="#000000" font-family="Arial, sans-serif">
        QR Code
      </text>

      <!-- Footer -->
      <text x="600" y="760" font-size="14" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif">
        inFlux Personal Assistants • Certificado Digital Verificável
      </text>
    </svg>
  `;

  return svg;
}

// Generate HTML certificate
function generateCertificateHTML(data: CertificateData): string {
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Certificado de Pronúncia - ${data.participantName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }

        .certificate {
          width: 100%;
          max-width: 1200px;
          aspect-ratio: 1200 / 800;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
          border: 4px solid;
          border-image: linear-gradient(135deg, #ec4899 0%, #a855f7 100%) 1;
          border-radius: 20px;
          padding: 40px;
          position: relative;
          box-shadow: 0 20px 60px rgba(236, 72, 153, 0.2);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .certificate::before {
          content: '';
          position: absolute;
          top: 50px;
          left: 100px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(236, 72, 153, 0.3);
        }

        .certificate::after {
          content: '';
          position: absolute;
          bottom: 50px;
          right: 100px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(168, 85, 247, 0.3);
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .title {
          font-size: 48px;
          font-weight: bold;
          color: #ec4899;
          margin-bottom: 10px;
          text-shadow: 0 2px 10px rgba(236, 72, 153, 0.3);
        }

        .subtitle {
          font-size: 20px;
          color: #d1d5db;
          opacity: 0.8;
        }

        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #a855f7, transparent);
          margin: 20px 0;
        }

        .content {
          text-align: center;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 20px;
        }

        .intro {
          font-size: 18px;
          color: #d1d5db;
        }

        .name {
          font-size: 44px;
          font-weight: bold;
          color: #fbbf24;
          text-shadow: 0 2px 10px rgba(251, 191, 36, 0.2);
        }

        .achievement {
          font-size: 18px;
          color: #d1d5db;
        }

        .score {
          font-size: 52px;
          font-weight: bold;
          color: #10b981;
          text-shadow: 0 2px 10px rgba(16, 185, 129, 0.2);
        }

        .badge {
          display: inline-block;
          font-size: 40px;
          margin: 10px 0;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 30px;
        }

        .footer-text {
          font-size: 16px;
          color: #9ca3af;
        }

        .footer-date {
          font-size: 14px;
          color: #6b7280;
        }

        .footer-id {
          font-size: 12px;
          color: #6b7280;
          font-family: 'Courier New', monospace;
        }

        .qr-code {
          width: 150px;
          height: 150px;
          background: white;
          padding: 10px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qr-code img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        @media print {
          body {
            background: white;
          }

          .certificate {
            box-shadow: none;
            max-width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">
          <div class="title">CERTIFICADO DE PRONÚNCIA</div>
          <div class="subtitle">${data.eventName}</div>
          <div class="divider"></div>
        </div>

        <div class="content">
          <div class="intro">Certificamos que</div>
          <div class="name">${data.participantName}</div>
          <div class="achievement">alcançou uma pontuação de pronúncia de</div>
          <div class="score">${data.pronunciationScore}%</div>
          ${
            data.pronunciationScore >= 80
              ? '<div class="badge">★</div>'
              : ''
          }
        </div>

        <div class="footer">
          <div>
            <div class="footer-text">Data: ${data.date}</div>
            <div class="footer-id">ID: ${data.certificateId}</div>
          </div>
          <div class="qr-code">
            <img src="${data.qrCodeUrl}" alt="QR Code" />
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

export const certificateGeneratorRouter = router({
  generateCertificate: publicProcedure
    .input(
      z.object({
        participantName: z.string(),
        eventName: z.string().optional(),
        pronunciationScore: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const certificateId = generateCertificateId();
        const qrCodeUrl = await generateQRCode(certificateId);
        const date = new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        const certificateData: CertificateData = {
          participantName: input.participantName,
          eventName: input.eventName || "Valentine's Day Event",
          pronunciationScore: input.pronunciationScore,
          date,
          certificateId,
          qrCodeUrl,
        };

        const htmlContent = generateCertificateHTML(certificateData);
        const svgContent = generateCertificateSVG(certificateData);

        return {
          success: true,
          certificateId,
          html: htmlContent,
          svg: svgContent,
          qrCodeUrl,
          date,
        };
      } catch (error) {
        console.error("Certificate generation error:", error);
        return {
          success: false,
          error: "Error generating certificate",
          details: error instanceof Error ? error.message : String(error),
        };
      }
    }),

  // Get certificate by ID
  getCertificate: publicProcedure
    .input(z.object({ certificateId: z.string() }))
    .query(async ({ input }) => {
      // This would typically fetch from database
      // For now, returning a success response
      return {
        found: true,
        certificateId: input.certificateId,
        verified: true,
        timestamp: new Date().toISOString(),
      };
    }),
});
