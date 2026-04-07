import { router, protectedProcedure, adminProcedure } from '../_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { getDb } from '../db';
import { exclusiveMaterials, materialStudentShare } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { storagePut, storageGet } from '../storage';

// Tipos de arquivo permitidos
const ALLOWED_TYPES = ['application/pdf', 'audio/mpeg', 'audio/wav', 'video/mp4', 'video/webm'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const materialUploadRouter = router({
  /**
   * Upload de material exclusivo (admin only)
   */
  uploadMaterial: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, 'Título é obrigatório'),
        description: z.string().optional(),
        fileBase64: z.string().min(1, 'Arquivo é obrigatório'),
        mimeType: z.string(),
        fileName: z.string(),
        studentIds: z.array(z.number()).optional(),
        classIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Validar tipo de arquivo
        if (!ALLOWED_TYPES.includes(input.mimeType)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Tipo de arquivo não permitido. Tipos aceitos: PDF, MP3, WAV, MP4, WebM`,
          });
        }

        // Converter base64 para buffer
        const buffer = Buffer.from(input.fileBase64, 'base64');

        // Validar tamanho
        if (buffer.length > MAX_FILE_SIZE) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Arquivo muito grande. Máximo: 50MB`,
          });
        }

        // Gerar nome único para S3
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(7);
        const fileKey = `materials/${ctx.user.id}/${timestamp}-${randomSuffix}-${input.fileName}`;

        // Upload para S3
        const { url } = await storagePut(fileKey, buffer, input.mimeType);

        // Determinar tipo de arquivo
        let fileType: 'pdf' | 'audio' | 'video' | 'document' = 'document';
        if (input.mimeType.includes('pdf')) fileType = 'pdf';
        else if (input.mimeType.includes('audio')) fileType = 'audio';
        else if (input.mimeType.includes('video')) fileType = 'video';

        // Salvar no banco de dados
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados não disponível',
          });
        }

        const result = await database
          .insert(exclusiveMaterials)
          .values({
            title: input.title,
            description: input.description || null,
            fileUrl: url,
            fileKey,
            fileType,
            fileSize: buffer.length,
            createdBy: ctx.user.id,
            createdAt: new Date(),
          });

        const materialId = (result[0] as any).insertId as number;

        // Compartilhar com alunos específicos
        if (input.studentIds && input.studentIds.length > 0) {
          await database.insert(materialStudentShare).values(
            input.studentIds.map((studentId) => ({
              materialId,
              studentId,
              sharedAt: new Date(),
            }))
          );
        }

        return {
          success: true,
          material: {
            id: materialId,
            title: input.title,
            fileType,
            fileSize: buffer.length,
            url,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao fazer upload: ${error}`,
        });
      }
    }),

  /**
   * Obter materiais compartilhados com o aluno autenticado
   */
  getMyMaterials: protectedProcedure.query(async ({ ctx }) => {
    try {
      const database = await getDb();
      if (!database) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Banco de dados não disponível',
        });
      }

      const materials = await database
        .select({
          id: exclusiveMaterials.id,
          title: exclusiveMaterials.title,
          description: exclusiveMaterials.description,
          fileType: exclusiveMaterials.fileType,
          fileSize: exclusiveMaterials.fileSize,
          fileUrl: exclusiveMaterials.fileUrl,
          createdAt: exclusiveMaterials.createdAt,
          createdBy: exclusiveMaterials.createdBy,
        })
        .from(exclusiveMaterials)
        .innerJoin(
          materialStudentShare,
          eq(exclusiveMaterials.id, materialStudentShare.materialId)
        )
        .where(eq(materialStudentShare.studentId, ctx.user.id));

      return {
        success: true,
        materials: materials.map((m: any) => ({
          ...m,
          size: formatFileSize(m.fileSize),
          sharedBy: 'Coordenador',
          sharedAt: m.createdAt,
        })),
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Erro ao obter materiais: ${error}`,
      });
    }
  }),

  /**
   * Obter todos os materiais (admin only)
   */
  getAllMaterials: adminProcedure.query(async ({ ctx }) => {
    try {
      const database = await getDb();
      if (!database) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Banco de dados não disponível',
        });
      }

      const materials = await database.select().from(exclusiveMaterials);

      return {
        success: true,
        materials: materials.map((m: any) => ({
          ...m,
          size: formatFileSize(m.fileSize),
        })),
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Erro ao obter materiais: ${error}`,
      });
    }
  }),

  /**
   * Deletar material (admin only)
   */
  deleteMaterial: adminProcedure
    .input(z.object({ materialId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Obter material
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados não disponível',
          });
        }

        const [material] = await database
          .select()
          .from(exclusiveMaterials)
          .where(eq(exclusiveMaterials.id, input.materialId));

        if (!material) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Material não encontrado',
          });
        }

        // Deletar do S3 (opcional - pode ser implementado depois)
        // await storageDelete(material.fileKey);

        // Deletar compartilhamentos
        await database
          .delete(materialStudentShare)
          .where(eq(materialStudentShare.materialId, input.materialId));

        // Deletar material
        await database
          .delete(exclusiveMaterials)
          .where(eq(exclusiveMaterials.id, input.materialId));

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao deletar material: ${error}`,
        });
      }
    }),

  /**
   * Compartilhar material com alunos
   */
  shareMaterialWithStudents: adminProcedure
    .input(
      z.object({
        materialId: z.number(),
        studentIds: z.array(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Verificar se material existe
        const database = await getDb();
        if (!database) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Banco de dados não disponível',
          });
        }

        const [material] = await database
          .select()
          .from(exclusiveMaterials)
          .where(eq(exclusiveMaterials.id, input.materialId));

        if (!material) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Material não encontrado',
          });
        }

        // Adicionar compartilhamentos
        await database.insert(materialStudentShare).values(
          input.studentIds.map((studentId) => ({
            materialId: input.materialId,
            studentId,
            sharedAt: new Date(),
          }))
        );

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erro ao compartilhar material: ${error}`,
        });
      }
    }),
});

/**
 * Formatar tamanho de arquivo em bytes para formato legível
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
