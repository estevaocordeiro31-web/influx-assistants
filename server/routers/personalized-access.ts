import { getDb } from './db';
import { personalizedLinks, exclusiveMaterials, materialClassShare, materialStudentShare, users } from '../drizzle/schema';
import { eq, and, gt, lt } from 'drizzle-orm';
import crypto from 'crypto';

/**
 * Gera um hash único para um link personalizado
 */
export function generateLinkHash(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Calcula a data de expiração (7 meses a partir de agora)
 */
export function calculateExpirationDate(): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + 7);
  return date;
}

/**
 * Cria um link personalizado para um aluno
 */
export async function createPersonalizedLink(studentId: number): Promise<{
  linkHash: string;
  expiresAt: Date;
  accessUrl: string;
}> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const linkHash = generateLinkHash();
  const expiresAt = calculateExpirationDate();

  await db.insert(personalizedLinks).values({
    studentId,
    linkHash,
    expiresAt,
    isActive: true,
  });

  return {
    linkHash,
    expiresAt,
    accessUrl: `/access/${linkHash}`,
  };
}

/**
 * Valida um link personalizado e retorna o ID do aluno
 */
export async function validatePersonalizedLink(linkHash: string): Promise<{
  studentId: number;
  studentName: string;
  isValid: boolean;
  message: string;
}> {
  const db = await getDb();
  if (!db) {
    return {
      studentId: 0,
      studentName: 'Desconhecido',
      isValid: false,
      message: 'Erro ao conectar ao banco de dados',
    };
  }
  
  const link = await db
    .select({
      id: personalizedLinks.id,
      studentId: personalizedLinks.studentId,
      expiresAt: personalizedLinks.expiresAt,
      isActive: personalizedLinks.isActive,
      studentName: users.name,
    })
    .from(personalizedLinks)
    .innerJoin(users, eq(personalizedLinks.studentId, users.id))
    .where(eq(personalizedLinks.linkHash, linkHash))
    .limit(1);

  if (!link || link.length === 0) {
    return {
      studentId: 0,
      studentName: 'Desconhecido',
      isValid: false,
      message: 'Link não encontrado',
    };
  }

  const linkData = link[0];
  const now = new Date();
  
  // Garantir que accessCount é um número (pode vir como undefined ou null)
  const currentAccessCount = typeof (linkData as any).accessCount === 'number' ? (linkData as any).accessCount : 0;

  if (!linkData.isActive) {
    return {
      studentId: linkData.studentId,
      studentName: linkData.studentName || 'Aluno',
      isValid: false,
      message: 'Este link foi desativado',
    };
  }

  if (linkData.expiresAt && new Date(linkData.expiresAt) < now) {
    return {
      studentId: linkData.studentId,
      studentName: linkData.studentName || 'Aluno',
      isValid: false,
      message: 'Este link expirou',
    };
  }

  // Atualiza o contador de acessos e data do último acesso
  await db
    .update(personalizedLinks)
    .set({
      accessedAt: now,
      accessCount: currentAccessCount + 1,
    })
    .where(eq(personalizedLinks.linkHash, linkHash));

  return {
    studentId: linkData.studentId,
    studentName: linkData.studentName || 'Aluno',
    isValid: true,
    message: 'Link válido',
  };
}

/**
 * Desativa um link personalizado
 */
export async function deactivatePersonalizedLink(linkHash: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db
    .update(personalizedLinks)
    .set({ isActive: false })
    .where(eq(personalizedLinks.linkHash, linkHash));

  return true;
}

/**
 * Compartilha um material com uma turma
 */
export async function shareMaterialWithClass(materialId: number, classId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(materialClassShare).values({
    materialId,
    classId,
  });
}

/**
 * Compartilha um material com um aluno individual
 */
export async function shareMaterialWithStudent(materialId: number, studentId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(materialStudentShare).values({
    materialId,
    studentId,
  });
}

/**
 * Obtém materiais compartilhados com um aluno (por turma + individual)
 */
export async function getStudentMaterials(studentId: number): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  // Primeiro, obter a turma do aluno (se houver)
  const student = await db
    .select()
    .from(users)
    .where(eq(users.id, studentId))
    .limit(1);

  if (!student || student.length === 0) {
    return [];
  }

  // Obter materiais compartilhados individualmente
  const individualMaterials = await db
    .select({
      id: exclusiveMaterials.id,
      title: exclusiveMaterials.title,
      description: exclusiveMaterials.description,
      fileUrl: exclusiveMaterials.fileUrl,
      fileKey: exclusiveMaterials.fileKey,
      fileType: exclusiveMaterials.fileType,
      fileSize: exclusiveMaterials.fileSize,
      createdAt: exclusiveMaterials.createdAt,
    })
    .from(exclusiveMaterials)
    .innerJoin(
      materialStudentShare,
      eq(exclusiveMaterials.id, materialStudentShare.materialId)
    )
    .where(
      and(
        eq(materialStudentShare.studentId, studentId),
        eq(exclusiveMaterials.isActive, true)
      )
    );

  return individualMaterials;
}

/**
 * Marca um material como acessado por um aluno
 */
export async function markMaterialAsAccessed(materialId: number, studentId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(materialStudentShare)
    .set({ accessedAt: new Date() })
    .where(
      and(
        eq(materialStudentShare.materialId, materialId),
        eq(materialStudentShare.studentId, studentId)
      )
    );
}

/**
 * Obtém estatísticas de um link personalizado
 */
export async function getLinkStatistics(linkHash: string): Promise<{
  studentName: string;
  createdAt: Date;
  expiresAt: Date;
  accessCount: number;
  lastAccessedAt: Date | null;
  isActive: boolean;
} | null> {
  const db = await getDb();
  if (!db) return null;
  
  const link = await db
    .select({
      studentName: users.name,
      createdAt: personalizedLinks.createdAt,
      expiresAt: personalizedLinks.expiresAt,
      accessCount: personalizedLinks.accessCount,
      accessedAt: personalizedLinks.accessedAt,
      isActive: personalizedLinks.isActive,
    })
    .from(personalizedLinks)
    .innerJoin(users, eq(personalizedLinks.studentId, users.id))
    .where(eq(personalizedLinks.linkHash, linkHash))
    .limit(1);

  if (!link || link.length === 0) {
    return null;
  }

  const linkData = link[0];
  return {
    studentName: linkData.studentName || 'Aluno',
    createdAt: linkData.createdAt,
    expiresAt: linkData.expiresAt,
    accessCount: linkData.accessCount || 0,
    lastAccessedAt: linkData.accessedAt || null,
    isActive: linkData.isActive || false,
  };
}
