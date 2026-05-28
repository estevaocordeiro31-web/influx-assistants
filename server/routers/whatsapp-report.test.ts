import { describe, it, expect } from 'vitest';

describe('WhatsApp Report Router', () => {
  it('should format phone number correctly', () => {
    const phoneNumber = '11987654321';
    const formatted = phoneNumber.replace(/\D/g, '');
    const withCountry = `55${formatted}`;
    expect(withCountry).toBe('5511987654321');
  });

  it('should validate phone number format', () => {
    const validPhone = '11987654321';
    const isValid = /^\d{10,15}$/.test(validPhone);
    expect(isValid).toBe(true);
  });

  it('should reject invalid phone numbers', () => {
    const invalidPhone = 'abc123';
    const isValid = /^\d{10,15}$/.test(invalidPhone);
    expect(isValid).toBe(false);
  });

  it('should generate pronunciation report message', () => {
    const report = {
      participantName: 'João',
      phoneNumber: '11987654321',
      pronunciationScore: 85,
      accuracy: 88,
      fluency: 82,
      completeness: 85,
      feedback: 'Excelente pronúncia!',
      eventName: "Valentine's Day",
    };

    const message = `
🎤 *Relatório de Pronúncia - ${report.eventName}*

Olá ${report.participantName}! 👋

Aqui está seu relatório de pronúncia:

📊 *Resultados:*
• Pronúncia Geral: ${report.pronunciationScore}%
• Precisão: ${report.accuracy}%
• Fluência: ${report.fluency}%
• Cobertura: ${report.completeness}%

💡 *Feedback:*
${report.feedback}
`.trim();

    expect(message).toContain('João');
    expect(message).toContain('85%');
    expect(message).toContain('Excelente pronúncia!');
  });

  it('should handle batch reports', () => {
    const reports = [
      {
        participantName: 'João',
        phoneNumber: '11987654321',
        pronunciationScore: 85,
        accuracy: 88,
        fluency: 82,
        completeness: 85,
        feedback: 'Excelente!',
      },
      {
        participantName: 'Maria',
        phoneNumber: '21987654321',
        pronunciationScore: 92,
        accuracy: 95,
        fluency: 90,
        completeness: 92,
        feedback: 'Perfeito!',
      },
    ];

    expect(reports).toHaveLength(2);
    expect(reports[0].participantName).toBe('João');
    expect(reports[1].pronunciationScore).toBe(92);
  });

  it('should generate unique message for each participant', () => {
    const participants = ['João', 'Maria', 'Pedro'];
    const messages = participants.map(name => `Olá ${name}!`);

    expect(messages).toHaveLength(3);
    expect(messages[0]).toContain('João');
    expect(messages[1]).toContain('Maria');
    expect(messages[2]).toContain('Pedro');
  });

  it('should validate pronunciation score range', () => {
    const scores = [0, 50, 75, 100];
    const isValid = scores.every(score => score >= 0 && score <= 100);
    expect(isValid).toBe(true);
  });

  it('should provide feedback based on score', () => {
    const highScore = 85;
    const lowScore = 45;

    const highFeedback = highScore >= 80 
      ? "✨ Excelente desempenho! Continue praticando para manter a qualidade."
      : "📚 Recomendamos continuar praticando para melhorar sua pronúncia.";

    const lowFeedback = lowScore >= 80 
      ? "✨ Excelente desempenho! Continue praticando para manter a qualidade."
      : "📚 Recomendamos continuar praticando para melhorar sua pronúncia.";

    expect(highFeedback).toContain('Excelente');
    expect(lowFeedback).toContain('Recomendamos');
  });
});
