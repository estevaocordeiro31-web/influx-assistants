// Template: Funções para gerar e atribuir IDs únicos
// Adicionar ao arquivo server/db.ts do projeto

import { sql } from "drizzle-orm";

// Configuração - ajustar conforme necessidade
const ID_PREFIX = "INF"; // Prefixo da organização
const ID_START = 30001;  // Número inicial (opcional)

/**
 * Gera um ID único no formato PREFIX-YYYY-NNNN
 * @param prefix - Prefixo da organização (ex: "INF", "STU")
 * @param year - Ano para o ID
 * @param sequence - Número sequencial
 */
export function generateStudentId(prefix: string, year: number, sequence: number): string {
  return `${prefix}-${year}-${String(sequence).padStart(4, '0')}`;
}

/**
 * Atribui um ID único a um usuário específico
 * @param userId - ID do usuário no banco
 * @returns O ID gerado ou null se falhar
 */
export async function assignStudentId(userId: number): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;

  // Verificar se já tem ID
  const existing = await db.execute(
    sql`SELECT student_id FROM users WHERE id = ${userId}`
  );
  
  const existingId = (existing as unknown[])[0] as { student_id: string | null } | undefined;
  if (existingId?.student_id) {
    return existingId.student_id;
  }

  // Gerar próximo ID
  const year = new Date().getFullYear();
  const pattern = `${ID_PREFIX}-${year}-%`;
  
  const maxResult = await db.execute(
    sql`SELECT MAX(CAST(SUBSTRING(student_id, -4) AS UNSIGNED)) as max_seq 
        FROM users WHERE student_id LIKE ${pattern}`
  );
  
  const maxSeq = ((maxResult as unknown[])[0] as { max_seq: number | null })?.max_seq || 0;
  const nextSeq = Math.max(maxSeq + 1, ID_START);
  const newId = generateStudentId(ID_PREFIX, year, nextSeq);

  // Atualizar usuário
  await db.execute(
    sql`UPDATE users SET student_id = ${newId} WHERE id = ${userId}`
  );

  return newId;
}

/**
 * Atribui IDs a todos os usuários que ainda não têm
 * @returns Número de usuários que receberam IDs
 */
export async function assignStudentIdsToAllUsers(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  // Buscar usuários sem ID
  const usersWithoutId = await db.execute(
    sql`SELECT id FROM users WHERE student_id IS NULL OR student_id = ''`
  );

  const users = usersWithoutId as unknown as { id: number }[];
  let count = 0;

  for (const user of users) {
    const id = await assignStudentId(user.id);
    if (id) count++;
  }

  return count;
}
