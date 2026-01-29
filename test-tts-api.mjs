/**
 * Script de teste para verificar se a API Forge suporta TTS
 */

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || "";
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY || "";

async function testTTSEndpoint() {
  console.log("=== Teste da API TTS ===\n");
  console.log("FORGE_API_URL:", FORGE_API_URL ? FORGE_API_URL.substring(0, 30) + "..." : "NÃO CONFIGURADO");
  console.log("FORGE_API_KEY:", FORGE_API_KEY ? "CONFIGURADO" : "NÃO CONFIGURADO");
  
  if (!FORGE_API_URL || !FORGE_API_KEY) {
    console.error("\n❌ Variáveis de ambiente não configuradas!");
    return;
  }
  
  const baseUrl = FORGE_API_URL.endsWith("/") ? FORGE_API_URL : `${FORGE_API_URL}/`;
  
  // Teste 1: Verificar endpoint /v1/audio/speech (OpenAI TTS)
  console.log("\n--- Teste 1: /v1/audio/speech ---");
  try {
    const ttsUrl = new URL("v1/audio/speech", baseUrl).toString();
    console.log("URL:", ttsUrl);
    
    const response = await fetch(ttsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FORGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "tts-1",
        input: "Hello, this is a test.",
        voice: "echo",
      }),
    });
    
    console.log("Status:", response.status, response.statusText);
    
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);
      console.log("✅ Endpoint TTS disponível!");
    } else {
      const errorText = await response.text();
      console.log("Erro:", errorText.substring(0, 200));
      console.log("❌ Endpoint TTS não disponível");
    }
  } catch (error) {
    console.error("Erro:", error.message);
  }
  
  // Teste 2: Verificar endpoint /v1/audio/transcriptions (Whisper)
  console.log("\n--- Teste 2: /v1/audio/transcriptions ---");
  try {
    const whisperUrl = new URL("v1/audio/transcriptions", baseUrl).toString();
    console.log("URL:", whisperUrl);
    
    // Apenas verificar se o endpoint existe (sem enviar arquivo)
    const response = await fetch(whisperUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FORGE_API_KEY}`,
      },
    });
    
    console.log("Status:", response.status, response.statusText);
    
    if (response.status !== 404) {
      console.log("✅ Endpoint Whisper disponível!");
    } else {
      console.log("❌ Endpoint Whisper não disponível");
    }
  } catch (error) {
    console.error("Erro:", error.message);
  }
  
  // Teste 3: Verificar endpoint /v1/chat/completions (LLM)
  console.log("\n--- Teste 3: /v1/chat/completions ---");
  try {
    const llmUrl = new URL("v1/chat/completions", baseUrl).toString();
    console.log("URL:", llmUrl);
    
    const response = await fetch(llmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FORGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [{ role: "user", content: "Say hello" }],
        max_tokens: 10,
      }),
    });
    
    console.log("Status:", response.status, response.statusText);
    
    if (response.ok) {
      console.log("✅ Endpoint LLM disponível!");
    } else {
      const errorText = await response.text();
      console.log("Erro:", errorText.substring(0, 200));
    }
  } catch (error) {
    console.error("Erro:", error.message);
  }
}

testTTSEndpoint();
