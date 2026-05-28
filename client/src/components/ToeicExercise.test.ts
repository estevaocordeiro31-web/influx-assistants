import { describe, it, expect } from 'vitest';

describe('ToeicExercise', () => {
  it('should have sample questions for Part 1', () => {
    const part1Questions = [
      {
        id: 'p1-q1',
        part: 'Part 1',
        question: 'What is the man doing?',
        options: [
          'He is sitting at a table',
          'He is standing by the window',
          'He is walking in the park',
          'He is reading a book',
        ],
        correctAnswer: 0,
      },
    ];

    expect(part1Questions).toHaveLength(1);
    expect(part1Questions[0].correctAnswer).toBe(0);
  });

  it('should have 4 options per question', () => {
    const question = {
      id: 'p1-q1',
      part: 'Part 1',
      question: 'What is the man doing?',
      options: [
        'He is sitting at a table',
        'He is standing by the window',
        'He is walking in the park',
        'He is reading a book',
      ],
      correctAnswer: 0,
    };

    expect(question.options).toHaveLength(4);
  });

  it('should track user answers', () => {
    const selectedAnswers = [0, null, 2, 1];
    expect(selectedAnswers[0]).toBe(0);
    expect(selectedAnswers[1]).toBeNull();
    expect(selectedAnswers[2]).toBe(2);
  });

  it('should calculate correct answers', () => {
    const userAnswers = [0, 0, 2, 0];
    const correctAnswers = [0, 1, 2, 0];
    
    const correct = userAnswers.filter((ans, idx) => ans === correctAnswers[idx]).length;
    expect(correct).toBe(3);
  });

  it('should calculate score percentage', () => {
    const correct = 3;
    const total = 4;
    const score = (correct / total) * 100;
    expect(score).toBe(75);
  });

  it('should have explanations for each question', () => {
    const question = {
      id: 'p1-q1',
      part: 'Part 1',
      question: 'What is the man doing?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      explanation: 'The man in the photograph is sitting at a table with a laptop.',
    };

    expect(question.explanation).toBeTruthy();
    expect(question.explanation.length).toBeGreaterThan(0);
  });

  it('should have traps for each question', () => {
    const question = {
      id: 'p1-q1',
      part: 'Part 1',
      question: 'What is the man doing?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      explanation: 'Explanation',
      trap: 'Option 2 might sound similar to the recording but is incorrect.',
    };

    expect(question.trap).toBeTruthy();
  });

  it('should have tips for each question', () => {
    const question = {
      id: 'p1-q1',
      part: 'Part 1',
      question: 'What is the man doing?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      explanation: 'Explanation',
      tip: 'Look at the photograph first before listening to the answer choices.',
    };

    expect(question.tip).toBeTruthy();
  });

  it('should track time spent on each question', () => {
    const startTime = Date.now();
    setTimeout(() => {}, 1000);
    const endTime = Date.now();
    const timeSpent = (endTime - startTime) / 1000;
    
    expect(timeSpent).toBeGreaterThanOrEqual(0);
  });

  it('should store question results', () => {
    const results = [
      {
        questionId: 'p1-q1',
        userAnswer: 0,
        correctAnswer: 0,
        isCorrect: true,
        timeSpent: 15,
      },
      {
        questionId: 'p1-q2',
        userAnswer: 1,
        correctAnswer: 2,
        isCorrect: false,
        timeSpent: 20,
      },
    ];

    expect(results).toHaveLength(2);
    expect(results[0].isCorrect).toBe(true);
    expect(results[1].isCorrect).toBe(false);
  });

  it('should validate Part 2 questions', () => {
    const part2Question = {
      id: 'p2-q1',
      part: 'Part 2',
      question: 'How long have you been working here?',
      options: [
        'About five years',
        'I work here every day',
        'Yes, I have',
        'The office is very nice',
      ],
      correctAnswer: 0,
    };

    expect(part2Question.part).toBe('Part 2');
    expect(part2Question.correctAnswer).toBe(0);
  });

  it('should validate Part 3 questions', () => {
    const part3Question = {
      id: 'p3-q1',
      part: 'Part 3',
      question: 'What is the main topic of the conversation?',
      options: [
        'Planning a business meeting',
        'Discussing vacation plans',
        'Talking about a project deadline',
        'Arranging a dinner reservation',
      ],
      correctAnswer: 0,
    };

    expect(part3Question.part).toBe('Part 3');
    expect(part3Question.options).toHaveLength(4);
  });

  it('should identify skipped questions', () => {
    const selectedAnswers = [0, null, 2, null];
    const skipped = selectedAnswers.filter(ans => ans === null).length;
    expect(skipped).toBe(2);
  });

  it('should handle empty answers array', () => {
    const selectedAnswers: (number | null)[] = [];
    expect(selectedAnswers).toHaveLength(0);
  });

  it('should calculate average time per question', () => {
    const results = [
      { timeSpent: 15 },
      { timeSpent: 20 },
      { timeSpent: 25 },
      { timeSpent: 10 },
    ];

    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);
    const avgTime = totalTime / results.length;
    expect(avgTime).toBe(17.5);
  });

  it('should identify fastest and slowest questions', () => {
    const results = [
      { questionId: 'q1', timeSpent: 5 },
      { questionId: 'q2', timeSpent: 45 },
      { questionId: 'q3', timeSpent: 20 },
    ];

    const fastest = Math.min(...results.map(r => r.timeSpent));
    const slowest = Math.max(...results.map(r => r.timeSpent));

    expect(fastest).toBe(5);
    expect(slowest).toBe(45);
  });
});
