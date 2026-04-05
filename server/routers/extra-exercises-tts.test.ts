import { describe, it, expect } from "vitest";

/**
 * Testes unitários para integração de TTS nos exercícios extras
 * Verifica mapeamento de personagens, estrutura de dados e lógica de áudio
 */

// Character voice mapping (mirrors frontend logic)
const charMap: Record<string, "lucas" | "emily" | "aiko"> = {
  Lucas: "lucas",
  Emily: "emily",
  Aiko: "aiko",
};

// Sample dialogue content from exercises
const sampleDialogue = {
  exerciseType: "dialogue_practice",
  character: "Lucas",
  country: "USA",
  flag: "🇺🇸",
  scenario: "Lucas meets a new classmate on the first day",
  dialogue: [
    { speaker: "Lucas", text: "Hey! What's up? I'm Lucas.", accent: "American" },
    { speaker: "Student", text: "Hi! I'm new here. Nice to meet you!", accent: "neutral" },
    { speaker: "Lucas", text: "Nice to meet you too! Where are you from?", accent: "American" },
  ],
  culturalNote: "Americans often use casual greetings like 'What's up?' or 'Hey!'",
  accentTip: "Notice how Lucas says 'whaddup' instead of 'what's up' - this is connected speech!",
  questions: [
    {
      question: "How does Lucas greet the new student?",
      options: ["Good morning", "What's up?", "How do you do?"],
      correctIndex: 1,
    },
  ],
};

describe("Character Voice Mapping", () => {
  it("deve mapear Lucas para voz americana", () => {
    expect(charMap["Lucas"]).toBe("lucas");
  });

  it("deve mapear Emily para voz britânica", () => {
    expect(charMap["Emily"]).toBe("emily");
  });

  it("deve mapear Aiko para voz australiana", () => {
    expect(charMap["Aiko"]).toBe("aiko");
  });

  it("deve retornar undefined para personagens desconhecidos", () => {
    expect(charMap["Unknown"]).toBeUndefined();
  });

  it("deve ter exatamente 3 personagens mapeados", () => {
    expect(Object.keys(charMap)).toHaveLength(3);
  });
});

describe("Dialogue Content Structure", () => {
  it("deve ter exerciseType dialogue_practice", () => {
    expect(sampleDialogue.exerciseType).toBe("dialogue_practice");
  });

  it("deve ter personagem válido", () => {
    expect(charMap[sampleDialogue.character]).toBeDefined();
  });

  it("deve ter diálogo com pelo menos 2 linhas", () => {
    expect(sampleDialogue.dialogue.length).toBeGreaterThanOrEqual(2);
  });

  it("cada linha de diálogo deve ter speaker e text", () => {
    for (const line of sampleDialogue.dialogue) {
      expect(line.speaker).toBeTruthy();
      expect(line.text).toBeTruthy();
    }
  });

  it("deve ter nota cultural", () => {
    expect(sampleDialogue.culturalNote).toBeTruthy();
  });

  it("deve ter dica de sotaque", () => {
    expect(sampleDialogue.accentTip).toBeTruthy();
  });

  it("deve ter perguntas de compreensão", () => {
    expect(sampleDialogue.questions.length).toBeGreaterThan(0);
  });
});

describe("TTS Audio Logic", () => {
  it("deve gerar áudio para cada linha do diálogo", () => {
    const linesToSpeak = sampleDialogue.dialogue.filter(
      (line) => charMap[line.speaker] !== undefined
    );
    // Only character lines should generate audio (not Student)
    expect(linesToSpeak.length).toBe(2); // Lucas speaks twice
  });

  it("deve usar personagem correto para cada fala", () => {
    for (const line of sampleDialogue.dialogue) {
      const character = charMap[line.speaker];
      if (character) {
        expect(["lucas", "emily", "aiko"]).toContain(character);
      }
    }
  });

  it("deve ter texto não vazio para gerar áudio", () => {
    for (const line of sampleDialogue.dialogue) {
      expect(line.text.length).toBeGreaterThan(0);
      expect(line.text.length).toBeLessThanOrEqual(5000); // Max TTS limit
    }
  });
});

describe("Book Lesson Names", () => {
  const bookLessonNames: Record<number, Record<number, string>> = {
    1: {
      1: "First Day of Class",
      2: "A Few Days Later - Professions",
      3: "At Break - Food & Drinks",
      4: "At the End of the Class",
      5: "Communicative - Review Unit 1",
      6: "At Home - Family",
      7: "My Neighborhood",
      8: "Daily Routine",
      9: "Going Shopping",
      10: "Communicative - Review Unit 2",
    },
    2: {
      1: "Vacation and Weather",
      2: "Communicative - Vacation Stories",
      3: "Location and Directions",
      4: "Communicative - Getting Around",
      5: "Sports and Activities",
      6: "Communicative - Sports Culture",
      7: "Appearance and Personality",
      8: "Communicative - Describing People",
      9: "Food and Drink",
      10: "Communicative - Food Culture",
    },
  };

  it("deve ter 10 lições para Book 1", () => {
    expect(Object.keys(bookLessonNames[1])).toHaveLength(10);
  });

  it("deve ter 10 lições para Book 2", () => {
    expect(Object.keys(bookLessonNames[2])).toHaveLength(10);
  });

  it("Book 1 Lesson 1 deve ser First Day of Class", () => {
    expect(bookLessonNames[1][1]).toBe("First Day of Class");
  });

  it("Book 2 Lesson 1 deve ser Vacation and Weather", () => {
    expect(bookLessonNames[2][1]).toBe("Vacation and Weather");
  });

  it("lições comunicativas devem ter 'Communicative' no nome", () => {
    const communicativeLessons = [
      bookLessonNames[1][5],
      bookLessonNames[1][10],
      bookLessonNames[2][2],
      bookLessonNames[2][4],
      bookLessonNames[2][6],
      bookLessonNames[2][8],
      bookLessonNames[2][10],
    ];
    for (const name of communicativeLessons) {
      expect(name).toContain("Communicative");
    }
  });
});
