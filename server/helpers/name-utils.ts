/**
 * Utilitários para manipulação de nomes no sistema inFlux
 * 
 * O sistema salva nomes no formato: "Samantha int Carlos 6789"
 * Onde:
 * - Samantha = primeiro nome do interessado
 * - int = interessado (ou outras tags)
 * - Carlos = nome do atendente/indicação
 * - 6789 = final do celular
 * 
 * Para mensagens, devemos usar APENAS o primeiro nome.
 */

/**
 * Extrai apenas o primeiro nome de um nome completo ou formatado
 * 
 * Exemplos:
 * - "Samantha int Carlos 6789" -> "Samantha"
 * - "João Silva" -> "João"
 * - "Maria" -> "Maria"
 * - "Ana Paula Santos" -> "Ana"
 * - "CARLOS EDUARDO" -> "Carlos"
 * 
 * @param fullName Nome completo ou formatado do sistema
 * @returns Primeiro nome capitalizado corretamente
 */
export function getFirstName(fullName: string | null | undefined): string {
  if (!fullName || typeof fullName !== 'string') {
    return '';
  }

  // Remove espaços extras e pega a primeira palavra
  const trimmed = fullName.trim();
  const firstName = trimmed.split(/\s+/)[0] || '';

  // Capitaliza corretamente (primeira letra maiúscula, resto minúsculo)
  return capitalizeFirstLetter(firstName);
}

/**
 * Capitaliza a primeira letra e deixa o resto em minúsculo
 * 
 * @param str String para capitalizar
 * @returns String capitalizada
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Extrai informações do nome formatado do sistema inFlux
 * 
 * Formato: "NomePessoa tag NomeAtendente FinalCel"
 * Exemplo: "Samantha int Carlos 6789"
 * 
 * @param formattedName Nome no formato do sistema
 * @returns Objeto com as partes extraídas
 */
export function parseInfluxName(formattedName: string | null | undefined): {
  firstName: string;
  tag: string | null;
  attendantName: string | null;
  phoneEnd: string | null;
  original: string;
} {
  const original = formattedName || '';
  
  if (!formattedName || typeof formattedName !== 'string') {
    return {
      firstName: '',
      tag: null,
      attendantName: null,
      phoneEnd: null,
      original,
    };
  }

  const parts = formattedName.trim().split(/\s+/);
  
  // Primeiro nome é sempre a primeira parte
  const firstName = capitalizeFirstLetter(parts[0] || '');
  
  // Tags conhecidas do sistema
  const knownTags = ['int', 'aluno', 'ex', 'ind', 'ret', 'ren'];
  
  let tag: string | null = null;
  let attendantName: string | null = null;
  let phoneEnd: string | null = null;

  // Procura por tag conhecida
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i].toLowerCase();
    
    if (knownTags.includes(part)) {
      tag = part;
    } else if (/^\d{4}$/.test(parts[i])) {
      // Final de telefone (4 dígitos)
      phoneEnd = parts[i];
    } else if (tag && !attendantName && !/^\d+$/.test(parts[i])) {
      // Nome do atendente (após a tag, não é número)
      attendantName = capitalizeFirstLetter(parts[i]);
    }
  }

  return {
    firstName,
    tag,
    attendantName,
    phoneEnd,
    original,
  };
}

/**
 * Formata uma saudação personalizada usando apenas o primeiro nome
 * 
 * @param fullName Nome completo ou formatado
 * @param greeting Saudação (ex: "Olá", "Boa tarde")
 * @returns Saudação formatada
 */
export function formatGreeting(fullName: string | null | undefined, greeting: string = 'Olá'): string {
  const firstName = getFirstName(fullName);
  
  if (!firstName) {
    return greeting;
  }
  
  return `${greeting}, ${firstName}`;
}

/**
 * Prepara o nome para uso em mensagens de campanha
 * Garante que apenas o primeiro nome seja usado
 * 
 * @param name Nome do sistema
 * @returns Nome preparado para mensagem
 */
export function prepareNameForMessage(name: string | null | undefined): string {
  return getFirstName(name);
}
