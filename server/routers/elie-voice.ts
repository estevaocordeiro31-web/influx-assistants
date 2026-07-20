import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

/**
 * Proxy do token ICE (relay TURN) do Azure Speech Real-Time Avatar.
 * A subscription key nunca sai do servidor — o client só recebe Urls/Username/Password
 * de curta duração pra montar o RTCPeerConnection.
 */
export const elieVoiceRouter = router({
  getIceToken: protectedProcedure.query(async () => {
    const endpoint = process.env.AZURE_FOUNDRY_ENDPOINT;
    const key = process.env.AZURE_FOUNDRY_KEY1;
    if (!endpoint || !key) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Azure Speech não configurado" });
    }
    const host = new URL(endpoint).hostname.replace(".services.ai.azure.com", ".cognitiveservices.azure.com");
    const url = `https://${host}/tts/cognitiveservices/avatar/relay/token/v1`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Ocp-Apim-Subscription-Key": key },
    });
    if (!res.ok) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Azure ICE token falhou: ${res.status}` });
    }
    const data = (await res.json()) as { Urls: string[]; Username: string; Password: string };
    const region = process.env.AZURE_FOUNDRY_REGION || "eastus2";

    // Token de autorização de curta duração (10min) pro SpeechConfig do client —
    // a subscription key crua nunca sai do servidor.
    const tokenRes = await fetch(`https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
      method: "POST",
      headers: { "Ocp-Apim-Subscription-Key": key, "Content-Length": "0" },
    });
    if (!tokenRes.ok) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Azure auth token falhou: ${tokenRes.status}` });
    }
    const authToken = await tokenRes.text();

    return {
      iceServers: [{ urls: data.Urls, username: data.Username, credential: data.Password }],
      region,
      authToken,
    };
  }),
});
