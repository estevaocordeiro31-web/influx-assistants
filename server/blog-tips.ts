import axios from "axios";
import { invokeLLM } from "./_core/llm";

export interface BlogTip {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  url: string;
  keywords: string[];
}

/**
 * Extrai dicas do blog inFlux
 */
export async function fetchBlogTips(): Promise<BlogTip[]> {
  try {
    // Em produção, fazer requisição HTTP real
    // const response = await axios.get("https://www.influx.com.br/blog/");
    // Parse HTML para extrair dicas (implementação simplificada)
    // Em produção, usar cheerio ou similar para parsing HTML
    
    const tips: BlogTip[] = [
      {
        id: "tip-001",
        title: "Vocabulário de praia em inglês",
        category: "Vocabulário",
        date: "08/01/2026",
        description: "Chegando o verão, muitas pessoas gostam curtir uma praia. Aprenda vocabulário de praia em inglês.",
        url: "https://www.influx.com.br/blog/vocabulario-de-praia-em-ingles/",
        keywords: ["praia", "vocabulário", "viagem", "verão"],
      },
      {
        id: "tip-002",
        title: "Chunks para chamar alguém para sair em inglês",
        category: "Chunks",
        date: "07/01/2026",
        description: "Aprenda chunks para convidar alguém para sair em inglês de forma natural.",
        url: "https://www.influx.com.br/blog/chunks-chamar-sair-ingles/",
        keywords: ["chunks", "convite", "conversação", "phrasal verbs"],
      },
      {
        id: "tip-003",
        title: "Aprendendo a usar a palavra 'enjoy' em inglês corretamente",
        category: "Dicas de Inglês",
        date: "06/01/2026",
        description: "Descubra como usar corretamente a palavra 'enjoy' em diferentes contextos.",
        url: "https://www.influx.com.br/blog/enjoy-ingles/",
        keywords: ["enjoy", "verbo", "gramática", "collocations"],
      },
      {
        id: "tip-004",
        title: "Quando 'get in' e 'get on' significam 'entrar' em inglês?",
        category: "Phrasal Verbs",
        date: "05/01/2026",
        description: "Entenda a diferença entre 'get in' e 'get on' e quando usar cada um.",
        url: "https://www.influx.com.br/blog/get-in-get-on/",
        keywords: ["phrasal verbs", "get in", "get on", "preposições"],
      },
      {
        id: "tip-005",
        title: "O que significa 'staycation' em inglês?",
        category: "O que significa",
        date: "04/01/2026",
        description: "Aprenda o significado de 'staycation' e como usar em conversas.",
        url: "https://www.influx.com.br/blog/staycation/",
        keywords: ["staycation", "vocabulário", "viagem", "férias"],
      },
    ];

    return tips;
  } catch (error) {
    console.error("[Blog Tips] Erro ao buscar dicas:", error);
    return [];
  }
}

/**
 * Recomenda dicas baseadas em dificuldades do aluno
 */
export async function recommendTipsForStudent(
  studentDifficulties: string[],
  allTips: BlogTip[]
): Promise<BlogTip[]> {
  if (studentDifficulties.length === 0) return [];

  try {
    // Usar LLM para encontrar dicas relevantes
    const prompt = `
      Dado o seguinte conjunto de dificuldades do aluno em inglês:
      ${studentDifficulties.join(", ")}

      E o seguinte conjunto de dicas disponíveis:
      ${allTips.map((tip) => `- ${tip.title} (${tip.category}): ${tip.keywords.join(", ")}`).join("\n")}

      Selecione as 3 dicas mais relevantes para ajudar o aluno com essas dificuldades.
      Retorne apenas os IDs das dicas selecionadas, separados por vírgula.
    `;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em educação de inglês. Sua tarefa é recomendar dicas relevantes baseado nas dificuldades do aluno.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message.content;
    const contentStr = typeof content === "string" ? content : "";
    const selectedIds = contentStr.split(",").map((id: string) => id.trim()) || [];

    return allTips.filter((tip) => selectedIds.includes(tip.id));
  } catch (error) {
    console.error("[Blog Tips] Erro ao recomendar dicas:", error);
    return [];
  }
}

/**
 * Analisa dificuldades do aluno baseado em histórico de exercícios
 */
export async function analyzeDifficulties(exerciseHistory: any[]): Promise<string[]> {
  // Agrupar exercícios por categoria
  const categories = new Map<string, number>();

  exerciseHistory.forEach((exercise) => {
    if (!exercise.correct) {
      const category = exercise.category || "general";
      categories.set(category, (categories.get(category) || 0) + 1);
    }
  });

  // Retornar categorias com mais erros
  const difficulties = Array.from(categories.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category]) => category);

  return difficulties;
}
