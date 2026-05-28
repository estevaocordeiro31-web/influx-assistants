import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

const Z_API_INSTANCE = "3ED2E8C4FC5EE20AA41A2287A6CE346F";
const Z_API_TOKEN = "CB492DBCF177CD6EECF95A7A";
const Z_API_BASE_URL = `https://api.z-api.io/instances/${Z_API_INSTANCE}`;

interface PronunciationReport {
  participantName: string;
  phoneNumber: string;
  pronunciationScore: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  feedback: string;
  eventName?: string;
}

// Format WhatsApp message with pronunciation report
function formatPronunciationReport(report: PronunciationReport): string {
  const eventName = report.eventName || "Valentine's Day Event";
  const message = `
🎤 *Relatório de Pronúncia - ${eventName}*

Olá ${report.participantName}! 👋

Aqui está seu relatório de pronúncia:

📊 *Resultados:*
• Pronúncia Geral: ${report.pronunciationScore}%
• Precisão: ${report.accuracy}%
• Fluência: ${report.fluency}%
• Cobertura: ${report.completeness}%

💡 *Feedback:*
${report.feedback}

🎯 *Próximos Passos:*
${report.pronunciationScore >= 80 
  ? "✨ Excelente desempenho! Continue praticando para manter a qualidade."
  : "📚 Recomendamos continuar praticando para melhorar sua pronúncia."}

Obrigado por participar! 🙏

*inFlux Personal Assistants*
`.trim();

  return message;
}

export const whatsappReportRouter = router({
  sendPronunciationReport: publicProcedure
    .input(
      z.object({
        participantName: z.string(),
        phoneNumber: z.string().regex(/^\d{10,15}$/, "Invalid phone number format"),
        pronunciationScore: z.number().min(0).max(100),
        accuracy: z.number().min(0).max(100),
        fluency: z.number().min(0).max(100),
        completeness: z.number().min(0).max(100),
        feedback: z.string(),
        eventName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const message = formatPronunciationReport(input);

        // Format phone number: remove non-digits and add country code if needed
        let phoneNumber = input.phoneNumber.replace(/\D/g, "");
        if (!phoneNumber.startsWith("55")) {
          phoneNumber = `55${phoneNumber}`;
        }

        // Send via Z-API
        const response = await fetch(`${Z_API_BASE_URL}/token/${Z_API_TOKEN}/send-text`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phoneNumber,
            message: message,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error("Z-API Error:", error);
          return {
            success: false,
            error: "Failed to send WhatsApp message",
            details: error,
          };
        }

        const result = await response.json();

        return {
          success: true,
          messageId: result.messageId || result.id,
          phone: phoneNumber,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error("WhatsApp send error:", error);
        return {
          success: false,
          error: "Error sending WhatsApp message",
          details: error instanceof Error ? error.message : String(error),
        };
      }
    }),

  // Batch send reports to multiple participants
  sendBatchPronunciationReports: publicProcedure
    .input(
      z.object({
        reports: z.array(
          z.object({
            participantName: z.string(),
            phoneNumber: z.string(),
            pronunciationScore: z.number().min(0).max(100),
            accuracy: z.number().min(0).max(100),
            fluency: z.number().min(0).max(100),
            completeness: z.number().min(0).max(100),
            feedback: z.string(),
            eventName: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const results = [];

      for (const report of input.reports) {
        try {
          const message = formatPronunciationReport(report);
          let phoneNumber = report.phoneNumber.replace(/\D/g, "");
          if (!phoneNumber.startsWith("55")) {
            phoneNumber = `55${phoneNumber}`;
          }

          const response = await fetch(`${Z_API_BASE_URL}/token/${Z_API_TOKEN}/send-text`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: phoneNumber,
              message: message,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            results.push({
              participantName: report.participantName,
              phone: phoneNumber,
              success: true,
              messageId: result.messageId || result.id,
            });
          } else {
            results.push({
              participantName: report.participantName,
              phone: phoneNumber,
              success: false,
              error: "Failed to send",
            });
          }
        } catch (error) {
          results.push({
            participantName: report.participantName,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }

        // Add delay between requests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      return {
        total: input.reports.length,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        results,
      };
    }),

  // Test WhatsApp connection
  testConnection: publicProcedure.query(async () => {
    try {
      const response = await fetch(`${Z_API_BASE_URL}/token/${Z_API_TOKEN}/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        return {
          connected: true,
          status: "Z-API instance is connected",
        };
      } else {
        return {
          connected: false,
          status: "Z-API instance is not responding",
        };
      }
    } catch (error) {
      return {
        connected: false,
        status: error instanceof Error ? error.message : "Connection error",
      };
    }
  }),
});
