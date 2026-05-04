/**
 * PDF Reports Generator
 * Generates student progress reports, performance analytics, and certificates
 */

import { getDb } from "./db";
import { 
  users, 
  studentProfiles, 
  studentChunkProgress, 
  conversations, 
  blogTipsBadges 
} from "../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";

// Types for report data
interface StudentReportData {
  student: {
    id: number;
    name: string;
    email: string;
    currentLevel: string;
    totalHours: number;
    streak: number;
    chunksLearned: number;
  };
  progress: {
    lessonsCompleted: number;
    exercisesCompleted: number;
    averageScore: number;
    strongAreas: string[];
    weakAreas: string[];
  };
  activity: {
    chatMessages: number;
    practiceMinutes: number;
    lastActive: Date | null;
  };
  badges: {
    id: number;
    name: string;
    unlockedAt: Date;
  }[];
  recommendations: string[];
}

interface ClassReportData {
  className: string;
  teacher: string;
  book: string;
  students: {
    name: string;
    attendance: number;
    averageScore: number;
    progress: string;
  }[];
  classAverage: number;
  topPerformers: string[];
  needsAttention: string[];
}

/**
 * Generate individual student progress report data
 */
export async function generateStudentReportData(userId: number): Promise<StudentReportData | null> {
  const db = await getDb();
  if (!db) return null;
  
  // Get user info
  const userData = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  
  if (userData.length === 0) {
    return null;
  }
  
  const user = userData[0];
  
  // Get student profile
  const profileData = await db
    .select()
    .from(studentProfiles)
    .where(eq(studentProfiles.userId, userId))
    .limit(1);
  
  const profile = profileData[0] || null;
  
  // Get chunk progress
  const chunkProgressData = await db
    .select()
    .from(studentChunkProgress)
    .where(eq(studentChunkProgress.studentId, userId));
  
  // Calculate statistics
  const masteredChunks = chunkProgressData.filter(c => c.masteryLevel === 'mastered').length;
  const learningChunks = chunkProgressData.filter(c => c.masteryLevel === 'learning' || c.masteryLevel === 'practicing').length;
  const totalAttempts = chunkProgressData.reduce((sum, c) => sum + c.totalAttempts, 0);
  const correctAnswers = chunkProgressData.reduce((sum, c) => sum + c.correctAnswers, 0);
  const averageScore = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
  
  // Get conversation count
  const conversationData = await db
    .select({
      count: sql<number>`count(*)`
    })
    .from(conversations)
    .where(eq(conversations.studentId, userId));
  
  // Get badges
  const badgesData = await db
    .select()
    .from(blogTipsBadges)
    .where(eq(blogTipsBadges.studentId, userId));
  
  // Analyze areas (simplified)
  const strongAreas: string[] = [];
  const weakAreas: string[] = [];
  
  if (averageScore >= 80) {
    strongAreas.push('Chunks e Expressões');
  } else if (averageScore < 60) {
    weakAreas.push('Chunks e Expressões');
  }
  
  if (masteredChunks > 50) {
    strongAreas.push('Vocabulário');
  } else if (masteredChunks < 10) {
    weakAreas.push('Vocabulário');
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (weakAreas.includes('Chunks e Expressões')) {
    recommendations.push('Pratique mais com o Fluxie usando exercícios de equivalência');
  }
  if (weakAreas.includes('Vocabulário')) {
    recommendations.push('Revise os chunks do Blog inFlux para expandir seu vocabulário');
  }
  if (averageScore < 70) {
    recommendations.push('Considere revisar as lições anteriores antes de avançar');
  }
  if ((profile?.streakDays || 0) < 7) {
    recommendations.push('Mantenha uma rotina diária de estudos para melhorar seu streak');
  }
  if (recommendations.length === 0) {
    recommendations.push('Continue com o excelente trabalho! Você está no caminho certo.');
  }
  
  return {
    student: {
      id: user.id,
      name: user.name || 'Aluno',
      email: user.email || '',
      currentLevel: profile?.currentLevel || 'beginner',
      totalHours: profile?.totalHoursLearned || 0,
      streak: profile?.streakDays || 0,
      chunksLearned: masteredChunks
    },
    progress: {
      lessonsCompleted: learningChunks + masteredChunks,
      exercisesCompleted: totalAttempts,
      averageScore,
      strongAreas,
      weakAreas
    },
    activity: {
      chatMessages: conversationData[0]?.count || 0,
      practiceMinutes: Math.round((profile?.totalHoursLearned || 0) * 60),
      lastActive: profile?.lastActivityAt || null
    },
    badges: badgesData.map(b => ({
      id: b.id,
      name: b.badgeName,
      unlockedAt: b.unlockedAt
    })),
    recommendations
  };
}

/**
 * Generate HTML report for a student
 */
export function generateStudentReportHTML(data: StudentReportData): string {
  const { student, progress, activity, badges, recommendations } = data;
  
  const levelNames: Record<string, string> = {
    'beginner': 'Iniciante',
    'elementary': 'Elementar',
    'intermediate': 'Intermediário',
    'upper_intermediate': 'Intermediário Superior',
    'advanced': 'Avançado',
    'proficient': 'Proficiente'
  };
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Progresso - ${student.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #0a0f1e 0%, #1a1f3e 100%);
      color: #ffffff;
      padding: 40px;
      min-height: 100vh;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(30, 41, 59, 0.9);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid rgba(0, 208, 132, 0.3);
    }
    .logo {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #00D084, #00a86b);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: bold;
      color: white;
    }
    .header-text h1 {
      font-size: 28px;
      color: #00D084;
      margin-bottom: 5px;
    }
    .header-text p {
      color: #94a3b8;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      color: #00D084;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-title::before {
      content: '';
      width: 4px;
      height: 20px;
      background: #00D084;
      border-radius: 2px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
    }
    .stat-card {
      background: rgba(0, 208, 132, 0.1);
      border: 1px solid rgba(0, 208, 132, 0.2);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #00D084;
    }
    .stat-label {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 5px;
    }
    .progress-bar {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      height: 20px;
      overflow: hidden;
      margin: 10px 0;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00D084, #00a86b);
      border-radius: 10px;
      transition: width 0.3s ease;
    }
    .areas-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .area-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 20px;
    }
    .area-card h4 {
      font-size: 14px;
      margin-bottom: 10px;
    }
    .area-card.strong h4 { color: #00D084; }
    .area-card.weak h4 { color: #f59e0b; }
    .area-list {
      list-style: none;
    }
    .area-list li {
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 14px;
    }
    .area-list li:last-child { border-bottom: none; }
    .badges-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .badge {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: bold;
    }
    .recommendations {
      background: rgba(0, 208, 132, 0.1);
      border-left: 4px solid #00D084;
      border-radius: 0 12px 12px 0;
      padding: 20px;
    }
    .recommendations ul {
      list-style: none;
    }
    .recommendations li {
      padding: 10px 0;
      padding-left: 20px;
      position: relative;
    }
    .recommendations li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: #00D084;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: #64748b;
      font-size: 12px;
    }
    @media print {
      body { background: white; color: black; padding: 20px; }
      .container { box-shadow: none; background: white; }
      .header-text h1 { color: #00a86b; }
      .section-title { color: #00a86b; }
      .stat-value { color: #00a86b; }
      .area-card.strong h4 { color: #00a86b; }
      .area-card.weak h4 { color: #d97706; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">F</div>
      <div class="header-text">
        <h1>Relatório de Progresso</h1>
        <p>${student.name} • ${student.email}</p>
        <p>Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">Visão Geral</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${student.totalHours}h</div>
          <div class="stat-label">Horas de Estudo</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${student.chunksLearned}</div>
          <div class="stat-label">Chunks Dominados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${student.streak}</div>
          <div class="stat-label">Dias Seguidos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${levelNames[student.currentLevel] || student.currentLevel}</div>
          <div class="stat-label">Nível Atual</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">Desempenho em Exercícios</h3>
      <p style="margin-bottom: 10px;">${progress.exercisesCompleted} exercícios completados</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress.averageScore}%"></div>
      </div>
      <p style="text-align: right; font-size: 14px; color: #94a3b8;">Média: ${progress.averageScore}%</p>
    </div>

    <div class="section">
      <h3 class="section-title">Análise de Áreas</h3>
      <div class="areas-grid">
        <div class="area-card strong">
          <h4>✓ Pontos Fortes</h4>
          <ul class="area-list">
            ${progress.strongAreas.length > 0 
              ? progress.strongAreas.map(a => `<li>${a}</li>`).join('')
              : '<li>Continue praticando para identificar seus pontos fortes</li>'
            }
          </ul>
        </div>
        <div class="area-card weak">
          <h4>⚠ Áreas para Melhorar</h4>
          <ul class="area-list">
            ${progress.weakAreas.length > 0 
              ? progress.weakAreas.map(a => `<li>${a}</li>`).join('')
              : '<li>Excelente! Nenhuma área crítica identificada</li>'
            }
          </ul>
        </div>
      </div>
    </div>

    ${badges.length > 0 ? `
    <div class="section">
      <h3 class="section-title">Conquistas</h3>
      <div class="badges-grid">
        ${badges.map(b => `<span class="badge">🏆 ${b.name}</span>`).join('')}
      </div>
    </div>
    ` : ''}

    <div class="section">
      <h3 class="section-title">Recomendações do Fluxie</h3>
      <div class="recommendations">
        <ul>
          ${recommendations.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="footer">
      <p>inFlux Personal Tutor • Powered by Fluxie AI</p>
      <p>Este relatório foi gerado automaticamente com base no seu progresso de aprendizado.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate class performance report data
 */
export async function generateClassReportData(className: string): Promise<ClassReportData | null> {
  // This would integrate with Sponte data in production
  // For now, return mock data structure
  return {
    className,
    teacher: 'Teacher',
    book: 'Book 1',
    students: [],
    classAverage: 0,
    topPerformers: [],
    needsAttention: []
  };
}
