function generatePersonalizedTutorPrompt(
  studentMessage: string,
  studentLevel: string,
  studentChunks: string[],
  context: string
): string {
  const cefr = LEVEL_TO_CEFR[studentLevel] || 'B1';
  const connectedSpeechRules = CONNECTED_SPEECH_RULES[cefr as keyof typeof CONNECTED_SPEECH_RULES] || [];

  return `You are an English tutor for a student at level ${cefr} (${studentLevel}).

IMPORTANT: Only use vocabulary and grammar from the student's current level and chunks they have studied:
${studentChunks.slice(0, 20).map((chunk) => `- ${chunk}`).join('\n')}

Student's message: "${studentMessage}"

Respond with JSON containing:
{
  "message": "Your personalized response using ONLY vocabulary from the student's chunks",
  "pronunciation": {
    "word": "A word from the student's message to focus on",
    "ipa": "IPA transcription",
    "tips": ["Pronunciation tip 1", "Pronunciation tip 2"]
  },
  "connectedSpeech": {
    "rule": "Connected speech rule (if applicable)",
    "example": "Example from the student's message or similar",
    "explanation": "Why this rule applies"
  },
  "realEnglishNote": {
    "formal": "Formal way to say it",
    "colloquial": "How native speakers really say it",
    "explanation": "Why the difference exists",
    "level": "${cefr}"
  }
}

Connected Speech Rules for this level:
${connectedSpeechRules.map((rule) => `- ${rule.rule}: ${rule.example} (${rule.explanation})`).join('\n')}

Context: ${context}

Remember: 
1. ONLY use vocabulary from the student's chunks
2. Focus on REAL ENGLISH that native speakers actually use
3. Adapt complexity to ${cefr} level
4. If the student uses words outside their level, gently correct and provide the simpler version`;
}
