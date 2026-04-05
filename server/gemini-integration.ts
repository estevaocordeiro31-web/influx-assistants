/**
 * Gemini Integration Helper
 * Handles bidirectional communication between Manus and Gemini AI
 */

import { ENV } from './_core/env';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export interface ProjectUpdate {
  type: 'checkpoint' | 'feature' | 'bug_fix' | 'improvement';
  title: string;
  description: string;
  version?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface GeminiSuggestion {
  id: string;
  category: 'ux' | 'pedagogy' | 'gamification' | 'data_analysis' | 'strategy';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  implementation_notes?: string;
  created_at: Date;
}

/**
 * Send project update to Gemini for analysis
 */
export async function sendUpdateToGemini(update: ProjectUpdate): Promise<{
  success: boolean;
  response?: string;
  error?: string;
}> {
  try {
    const prompt = `
Você é o Gemini AI, colaborador estratégico do projeto inFlux Personal Tutor.

ATUALIZAÇÃO DO PROJETO:
Tipo: ${update.type}
Título: ${update.title}
Descrição: ${update.description}
${update.version ? `Versão: ${update.version}` : ''}
Data: ${update.timestamp.toISOString()}

CONTEXTO DO PROJETO:
O inFlux Personal Tutor é um assistente de IA para ensino de inglês que complementa o material didático da rede inFlux. O sistema atua como tutor personalizado, oferecendo prática adicional, feedback em tempo real e conteúdo adaptado ao nível de cada aluno.

SUAS RESPONSABILIDADES:
1. Analisar a atualização e identificar oportunidades de melhoria
2. Sugerir melhorias de UX, conteúdo pedagógico, gamificação ou estratégia
3. Priorizar sugestões baseado em impacto pedagógico e viabilidade técnica

Por favor, analise esta atualização e forneça:
1. Um resumo do que foi implementado
2. 2-3 sugestões concretas de melhorias relacionadas
3. Prioridade de cada sugestão (low/medium/high/critical)

Responda em formato JSON:
{
  "summary": "resumo da análise",
  "suggestions": [
    {
      "category": "ux|pedagogy|gamification|data_analysis|strategy",
      "title": "título curto",
      "description": "descrição detalhada",
      "priority": "low|medium|high|critical",
      "implementation_notes": "notas técnicas"
    }
  ]
}
`;

    const response = await fetch(`${GEMINI_API_URL}?key=${ENV.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      success: true,
      response: responseText,
    };
  } catch (error: any) {
    console.error('[Gemini Integration] Error sending update:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Parse Gemini response and extract suggestions
 */
export function parseGeminiResponse(response: string): GeminiSuggestion[] {
  try {
    // Remove markdown code blocks if present
    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanedResponse);

    if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
      return [];
    }

    return parsed.suggestions.map((s: any, index: number) => ({
      id: `gemini-${Date.now()}-${index}`,
      category: s.category || 'strategy',
      title: s.title || 'Untitled Suggestion',
      description: s.description || '',
      priority: s.priority || 'medium',
      implementation_notes: s.implementation_notes,
      created_at: new Date(),
    }));
  } catch (error) {
    console.error('[Gemini Integration] Error parsing response:', error);
    return [];
  }
}

/**
 * Send full project context to Gemini
 */
export async function sendProjectContextToGemini(context: {
  version: string;
  features: string[];
  metrics: Record<string, any>;
  challenges: string[];
}): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    const prompt = `
CONTEXTO COMPLETO DO PROJETO inFlux Personal Tutor:

VERSÃO ATUAL: ${context.version}

FUNCIONALIDADES IMPLEMENTADAS:
${context.features.map((f, i) => `${i + 1}. ${f}`).join('\n')}

MÉTRICAS:
${JSON.stringify(context.metrics, null, 2)}

DESAFIOS ATUAIS:
${context.challenges.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Por favor, forneça uma análise estratégica do projeto e sugira os próximos passos prioritários para maximizar o impacto pedagógico e o engajamento dos alunos.

Responda em formato JSON com:
{
  "analysis": "análise estratégica",
  "next_steps": ["passo 1", "passo 2", "passo 3"],
  "risks": ["risco 1", "risco 2"],
  "opportunities": ["oportunidade 1", "oportunidade 2"]
}
`;

    const response = await fetch(`${GEMINI_API_URL}?key=${ENV.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      success: true,
      response: responseText,
    };
  } catch (error: any) {
    console.error('[Gemini Integration] Error sending context:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
