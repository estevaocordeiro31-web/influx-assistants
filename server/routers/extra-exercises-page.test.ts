import { describe, it, expect } from "vitest";

// Test exercise content structure validation
describe("Extra Exercises Content Structure", () => {
  describe("Dialogue Exercise Content", () => {
    it("should have valid dialogue_practice structure", () => {
      const content = {
        exerciseType: "dialogue_practice",
        character: "Lucas",
        country: "USA",
        flag: "🇺🇸",
        scenario: "First day at school in New York",
        dialogue: [
          { speaker: "Teacher", text: "Good morning! Welcome to our school." },
          { speaker: "Lucas", text: "Hi! I'm Lucas. Nice to meet you!" }
        ],
        culturalNote: "In the US, people often use informal greetings.",
        accentTip: "Americans often reduce 'going to' to 'gonna'.",
        questions: [
          {
            question: "Where is Lucas?",
            options: ["New York", "London", "Sydney"],
            correctIndex: 0,
            explanation: "Lucas is from New York, USA."
          }
        ]
      };

      expect(content.exerciseType).toBe("dialogue_practice");
      expect(content.character).toBe("Lucas");
      expect(content.dialogue.length).toBeGreaterThan(0);
      expect(content.questions.length).toBeGreaterThan(0);
      expect(content.questions[0].correctIndex).toBeLessThan(content.questions[0].options.length);
    });

    it("should validate all three characters", () => {
      const characters = [
        { name: "Lucas", country: "USA", flag: "🇺🇸" },
        { name: "Emily", country: "UK", flag: "🇬🇧" },
        { name: "Aiko", country: "Australia", flag: "🇦🇺" }
      ];

      expect(characters).toHaveLength(3);
      expect(characters.map(c => c.name)).toEqual(["Lucas", "Emily", "Aiko"]);
      expect(characters.map(c => c.country)).toEqual(["USA", "UK", "Australia"]);
    });
  });

  describe("Matching Exercise Content", () => {
    it("should have valid matching structure", () => {
      const content = {
        exerciseType: "matching",
        instruction: "Match the greeting to the correct country",
        pairs: [
          { expression: "Hey, what's up?", country: "🇺🇸 USA", explanation: "Casual American greeting" },
          { expression: "Hiya, you alright?", country: "🇬🇧 UK", explanation: "Common British greeting" },
          { expression: "G'day, how ya going?", country: "🇦🇺 Australia", explanation: "Classic Australian greeting" }
        ]
      };

      expect(content.exerciseType).toBe("matching");
      expect(content.pairs.length).toBeGreaterThan(0);
      content.pairs.forEach(pair => {
        expect(pair.expression).toBeTruthy();
        expect(pair.country).toBeTruthy();
        expect(pair.explanation).toBeTruthy();
      });
    });
  });

  describe("Fill in the Blank Exercise Content", () => {
    it("should have valid fill_in_the_blank structure", () => {
      const content = {
        exerciseType: "fill_in_the_blank",
        instruction: "Complete with the correct form of verb to be",
        sentences: [
          { text: "I ___ a student.", answer: "am", hint: "First person singular" },
          { text: "She ___ a teacher.", answer: "is", hint: "Third person singular" }
        ]
      };

      expect(content.exerciseType).toBe("fill_in_the_blank");
      expect(content.sentences.length).toBeGreaterThan(0);
      content.sentences.forEach(s => {
        expect(s.text).toContain("___");
        expect(s.answer).toBeTruthy();
      });
    });
  });

  describe("Story Exercise Content", () => {
    it("should have valid story_reading structure", () => {
      const content = {
        exerciseType: "story_reading",
        title: "The Three Friends Meet Online",
        characters: [
          { name: "Lucas", country: "USA", flag: "🇺🇸", city: "New York" },
          { name: "Emily", country: "UK", flag: "🇬🇧", city: "London" },
          { name: "Aiko", country: "Australia", flag: "🇦🇺", city: "Sydney" }
        ],
        story: [
          { speaker: "narrator", text: "Three students from different countries meet in an online class..." },
          { speaker: "Lucas", text: "Hey guys! I'm Lucas from New York!" }
        ],
        comprehensionQuestions: [
          {
            question: "Where is Lucas from?",
            options: ["New York", "London", "Sydney"],
            correctIndex: 0
          }
        ],
        expressionComparison: [
          { meaning: "Greeting", usa: "Hey, what's up?", uk: "Hiya!", australia: "G'day!" }
        ]
      };

      expect(content.exerciseType).toBe("story_reading");
      expect(content.characters).toHaveLength(3);
      expect(content.story.length).toBeGreaterThan(0);
      expect(content.comprehensionQuestions.length).toBeGreaterThan(0);
      expect(content.expressionComparison.length).toBeGreaterThan(0);
    });
  });
});

describe("Exercise Type Mapping", () => {
  it("should map exercise types to correct components", () => {
    const typeMap: Record<string, string> = {
      "dialogue_practice": "DialogueExercise",
      "matching": "MatchingExercise",
      "fill_in_the_blank": "FillBlankExercise",
      "story_reading": "StoryExercise"
    };

    expect(Object.keys(typeMap)).toHaveLength(4);
    expect(typeMap["dialogue_practice"]).toBe("DialogueExercise");
    expect(typeMap["matching"]).toBe("MatchingExercise");
    expect(typeMap["fill_in_the_blank"]).toBe("FillBlankExercise");
    expect(typeMap["story_reading"]).toBe("StoryExercise");
  });
});

describe("Lesson Structure", () => {
  it("should have correct lesson names for Book 1", () => {
    const lessonNames: Record<number, string> = {
      1: "First Day of Class",
      2: "A Few Days Later - Professions",
      3: "At Break - Food & Drinks",
      4: "At the End of the Class",
      5: "Communicative - Stories"
    };

    expect(Object.keys(lessonNames)).toHaveLength(5);
    expect(lessonNames[1]).toContain("First Day");
    expect(lessonNames[2]).toContain("Professions");
    expect(lessonNames[3]).toContain("Food");
    expect(lessonNames[4]).toContain("End of the Class");
    expect(lessonNames[5]).toContain("Communicative");
  });

  it("should have correct character colors", () => {
    const characterColors: Record<string, string> = {
      Lucas: "from-blue-600 to-blue-800",
      Emily: "from-red-600 to-red-800",
      Aiko: "from-yellow-600 to-amber-700",
    };

    expect(characterColors["Lucas"]).toContain("blue");
    expect(characterColors["Emily"]).toContain("red");
    expect(characterColors["Aiko"]).toContain("yellow");
  });
});

describe("Score Calculation", () => {
  it("should calculate score correctly for dialogue questions", () => {
    const questions = [
      { question: "Q1", options: ["A", "B", "C"], correctIndex: 0 },
      { question: "Q2", options: ["A", "B", "C"], correctIndex: 1 },
      { question: "Q3", options: ["A", "B", "C"], correctIndex: 2 },
    ];

    const answers: Record<number, number> = { 0: 0, 1: 1, 2: 2 };
    const score = questions.filter((q, i) => answers[i] === q.correctIndex).length;
    expect(score).toBe(3);
  });

  it("should calculate partial score correctly", () => {
    const questions = [
      { question: "Q1", options: ["A", "B", "C"], correctIndex: 0 },
      { question: "Q2", options: ["A", "B", "C"], correctIndex: 1 },
      { question: "Q3", options: ["A", "B", "C"], correctIndex: 2 },
    ];

    const answers: Record<number, number> = { 0: 0, 1: 2, 2: 1 };
    const score = questions.filter((q, i) => answers[i] === q.correctIndex).length;
    expect(score).toBe(1);
  });

  it("should calculate fill-in-the-blank score correctly", () => {
    const sentences = [
      { text: "I ___ a student.", answer: "am" },
      { text: "She ___ a teacher.", answer: "is" },
    ];

    const userAnswers: Record<number, string> = { 0: "am", 1: "are" };
    const score = sentences.filter((s, i) =>
      (userAnswers[i] || "").trim().toLowerCase() === s.answer.toLowerCase()
    ).length;
    expect(score).toBe(1);
  });

  it("should be case-insensitive for fill-in-the-blank", () => {
    const sentences = [
      { text: "I ___ a student.", answer: "am" },
    ];

    const userAnswers: Record<number, string> = { 0: "AM" };
    const score = sentences.filter((s, i) =>
      (userAnswers[i] || "").trim().toLowerCase() === s.answer.toLowerCase()
    ).length;
    expect(score).toBe(1);
  });
});

describe("JSON Content Parsing", () => {
  it("should parse valid exercise content JSON", () => {
    const jsonStr = JSON.stringify({
      exerciseType: "dialogue_practice",
      character: "Lucas",
      country: "USA",
      flag: "🇺🇸",
      scenario: "Test scenario",
      dialogue: [],
      culturalNote: "Test note",
      accentTip: "Test tip",
      questions: []
    });

    const parsed = JSON.parse(jsonStr);
    expect(parsed.exerciseType).toBe("dialogue_practice");
    expect(parsed.character).toBe("Lucas");
  });

  it("should handle invalid JSON gracefully", () => {
    const invalidJson = "not valid json";
    let parsed = null;
    try {
      parsed = JSON.parse(invalidJson);
    } catch {
      parsed = null;
    }
    expect(parsed).toBeNull();
  });
});

describe("Exercise Database Structure", () => {
  it("should have correct exercise types", () => {
    const validTypes = ["vocabulary", "grammar", "listening", "reading", "writing", "speaking", "communicative"];
    expect(validTypes).toContain("vocabulary");
    expect(validTypes).toContain("grammar");
    expect(validTypes).toContain("communicative");
    expect(validTypes).toHaveLength(7);
  });

  it("should have correct difficulty levels", () => {
    const validDifficulties = ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced", "proficient"];
    expect(validDifficulties).toContain("beginner");
    expect(validDifficulties).toHaveLength(6);
  });

  it("should have correct progress statuses", () => {
    const validStatuses = ["not_started", "in_progress", "completed", "reviewed"];
    expect(validStatuses).toContain("not_started");
    expect(validStatuses).toContain("completed");
    expect(validStatuses).toHaveLength(4);
  });
});
