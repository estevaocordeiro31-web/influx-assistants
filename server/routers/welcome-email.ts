/**
 * Welcome Email Helper
 * Envia emails de boas-vindas para novos alunos com credenciais de acesso
 */

import { notifyOwner } from './_core/notification';

interface WelcomeEmailData {
  studentName: string;
  email: string;
  password: string;
  loginUrl: string;
}

/**
 * Template HTML do email de boas-vindas
 */
function getWelcomeEmailTemplate(data: WelcomeEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #00a86b 0%, #00c896 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
    }
    .credentials-box {
      background-color: #f8f9fa;
      border-left: 4px solid #00a86b;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .credentials-box h3 {
      margin-top: 0;
      color: #00a86b;
    }
    .credential-item {
      margin: 10px 0;
      font-size: 16px;
    }
    .credential-label {
      font-weight: bold;
      color: #555;
    }
    .credential-value {
      color: #333;
      background-color: #fff;
      padding: 8px 12px;
      border-radius: 4px;
      display: inline-block;
      margin-left: 10px;
      font-family: 'Courier New', monospace;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #00a86b 0%, #00c896 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 15px 40px;
      border-radius: 25px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .features {
      margin: 30px 0;
    }
    .feature-item {
      display: flex;
      align-items: start;
      margin: 15px 0;
    }
    .feature-icon {
      font-size: 24px;
      margin-right: 15px;
    }
    .feature-text {
      flex: 1;
    }
    .feature-title {
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    .feature-description {
      color: #666;
      font-size: 14px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Bem-vindo ao inFlux Personal Tutor!</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Olá, <strong>${data.studentName}</strong>!</p>
      
      <p>Estamos muito felizes em ter você conosco! Seu assistente pessoal de IA já está pronto para te ajudar a dominar o inglês de forma personalizada e eficiente.</p>
      
      <div class="credentials-box">
        <h3>🔐 Suas Credenciais de Acesso</h3>
        <div class="credential-item">
          <span class="credential-label">Email:</span>
          <span class="credential-value">${data.email}</span>
        </div>
        <div class="credential-item">
          <span class="credential-label">Senha:</span>
          <span class="credential-value">${data.password}</span>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="${data.loginUrl}" class="cta-button">Acessar Meu Personal Tutor</a>
      </div>
      
      <div class="features">
        <h3 style="color: #333;">O que você pode fazer:</h3>
        
        <div class="feature-item">
          <div class="feature-icon">💬</div>
          <div class="feature-text">
            <div class="feature-title">Chat com IA</div>
            <div class="feature-description">Converse com o Fluxie, seu assistente pessoal, e pratique inglês em situações reais</div>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">📝</div>
          <div class="feature-text">
            <div class="feature-title">Exercícios Personalizados</div>
            <div class="feature-description">Pratique com exercícios adaptados ao seu nível e objetivos</div>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">📚</div>
          <div class="feature-text">
            <div class="feature-title">Dicas do Blog</div>
            <div class="feature-description">Receba dicas diárias personalizadas baseadas nas suas dificuldades</div>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">📖</div>
          <div class="feature-text">
            <div class="feature-title">Reading Club</div>
            <div class="feature-description">Participe do clube de leitura e ganhe influxcoins</div>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon">🎯</div>
          <div class="feature-text">
            <div class="feature-title">Progresso Personalizado</div>
            <div class="feature-description">Acompanhe sua evolução com relatórios detalhados</div>
          </div>
        </div>
      </div>
      
      <p style="margin-top: 30px; color: #666;">
        <strong>Dica:</strong> No primeiro acesso, você verá um tutorial interativo que explica todas as funcionalidades. Não pule! 😉
      </p>
    </div>
    
    <div class="footer">
      <p>Precisa de ajuda? Entre em contato com a coordenação.</p>
      <p style="margin-top: 10px; font-size: 12px;">
        Este é um email automático. Por favor, não responda.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Envia email de boas-vindas para um aluno
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  try {
    const emailContent = getWelcomeEmailTemplate(data);
    
    // Por enquanto, notifica o owner com os detalhes
    // Em produção, você integraria com um serviço de email real (SendGrid, AWS SES, etc.)
    const notificationSent = await notifyOwner({
      title: `Novo aluno cadastrado: ${data.studentName}`,
      content: `Email: ${data.email}\nSenha: ${data.password}\n\nEmail de boas-vindas pronto para envio.`
    });
    
    console.log(`[WelcomeEmail] Email preparado para ${data.studentName} (${data.email})`);
    
    return notificationSent;
  } catch (error) {
    console.error(`[WelcomeEmail] Erro ao enviar email para ${data.email}:`, error);
    return false;
  }
}

/**
 * Envia emails de boas-vindas em lote
 */
export async function sendBulkWelcomeEmails(students: WelcomeEmailData[]): Promise<{
  sent: number;
  failed: number;
}> {
  let sent = 0;
  let failed = 0;
  
  for (const student of students) {
    const success = await sendWelcomeEmail(student);
    if (success) {
      sent++;
    } else {
      failed++;
    }
    
    // Pequeno delay para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`[WelcomeEmail] Lote concluído: ${sent} enviados, ${failed} falharam`);
  
  return { sent, failed };
}
