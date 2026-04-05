import { z } from 'zod';

/**
 * Schemas de validação Zod para formulários do inFlux
 * Mensagens de erro em português para melhor UX
 */

// ============================================================================
// VALIDAÇÃO DE LOGIN
// ============================================================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' })
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: 'Senha é obrigatória' })
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
    .max(100, { message: 'Senha muito longa' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================================================
// VALIDAÇÃO DE CRIAÇÃO DE ALUNO
// ============================================================================

export const createStudentSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Nome é obrigatório' })
    .min(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
    .max(100, { message: 'Nome muito longo' })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: 'Nome contém caracteres inválidos' }),
  email: z
    .string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' })
    .toLowerCase(),
  level: z
    .enum(['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient'] as const)
    .catch('beginner'),
  objective: z
    .enum(['career', 'travel', 'studies', 'other'] as const)
    .catch('other'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\(\)]+$/.test(val),
      { message: 'Telefone inválido' }
    ),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

// ============================================================================
// VALIDAÇÃO DE EDIÇÃO DE PERFIL
// ============================================================================

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
    .max(100, { message: 'Nome muito longo' })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: 'Nome contém caracteres inválidos' })
    .optional(),
  level: z
    .enum(['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient'] as const)
    .optional(),
  objective: z
    .enum(['career', 'travel', 'studies', 'other'] as const)
    .optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\(\)]+$/.test(val),
      { message: 'Telefone inválido' }
    ),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ============================================================================
// VALIDAÇÃO DE FILTROS
// ============================================================================

export const filterSchema = z.object({
  searchTerm: z.string().max(100, { message: 'Busca muito longa' }).optional(),
  filterLevel: z
    .enum(['', 'beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient'] as const)
    .optional(),
  filterObjective: z
    .enum(['', 'career', 'travel', 'studies', 'other'] as const)
    .optional(),
  filterStatus: z
    .enum(['', 'ativo', 'inativo', 'desistente', 'trancado'] as const)
    .optional(),
  limit: z.number().min(1).max(1000).default(500),
  offset: z.number().min(0).default(0),
});

export type FilterInput = z.infer<typeof filterSchema>;

// ============================================================================
// VALIDAÇÃO DE EXERCÍCIO
// ============================================================================

export const exerciseSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Título é obrigatório' })
    .min(5, { message: 'Título deve ter no mínimo 5 caracteres' })
    .max(200, { message: 'Título muito longo' }),
  description: z
    .string()
    .min(10, { message: 'Descrição deve ter no mínimo 10 caracteres' })
    .max(2000, { message: 'Descrição muito longa' }),
  type: z
    .enum(['dialogue', 'matching', 'fill_blank', 'story', 'listening'] as const),
  book: z
    .enum(['book1', 'book2', 'book3', 'book4', 'book5'] as const),
  difficulty: z
    .enum(['easy', 'medium', 'hard'] as const),
});

export type ExerciseInput = z.infer<typeof exerciseSchema>;

// ============================================================================
// VALIDAÇÃO DE BADGE/SEAL
// ============================================================================

export const badgeSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Nome do selo é obrigatório' })
    .max(100, { message: 'Nome muito longo' }),
  description: z
    .string()
    .max(500, { message: 'Descrição muito longa' })
    .optional(),
  icon: z
    .string()
    .url({ message: 'URL do ícone inválida' })
    .optional(),
  requirement: z
    .number()
    .min(1, { message: 'Requisito deve ser no mínimo 1' })
    .max(10000, { message: 'Requisito muito alto' }),
});

export type BadgeInput = z.infer<typeof badgeSchema>;

// ============================================================================
// VALIDAÇÃO DE ATIVIDADE
// ============================================================================

export const activitySchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Título é obrigatório' })
    .min(5, { message: 'Título deve ter no mínimo 5 caracteres' })
    .max(200, { message: 'Título muito longo' }),
  description: z
    .string()
    .min(10, { message: 'Descrição deve ter no mínimo 10 caracteres' })
    .max(2000, { message: 'Descrição muito longa' }),
  date: z
    .string()
    .datetime({ message: 'Data inválida' }),
  location: z
    .string()
    .max(200, { message: 'Localização muito longa' })
    .optional(),
  tags: z
    .array(z.string())
    .min(1, { message: 'Selecione pelo menos uma tag' })
    .max(5, { message: 'Máximo 5 tags' }),
  maxParticipants: z
    .number()
    .min(1, { message: 'Mínimo 1 participante' })
    .max(1000, { message: 'Máximo 1000 participantes' })
    .optional(),
});

export type ActivityInput = z.infer<typeof activitySchema>;

// ============================================================================
// VALIDAÇÃO DE MUDANÇA DE SENHA
// ============================================================================

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: 'Senha atual é obrigatória' }),
  newPassword: z
    .string()
    .min(6, { message: 'Nova senha deve ter no mínimo 6 caracteres' })
    .max(100, { message: 'Senha muito longa' }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Confirmação de senha obrigatória' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não correspondem',
  path: ['confirmPassword'],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ============================================================================
// FUNÇÃO AUXILIAR PARA TRATAMENTO DE ERROS
// ============================================================================

export function getValidationErrors(error: z.ZodError<any>): Record<string, string> {
  const errors: Record<string, string> = {};
  error.issues.forEach((issue: z.ZodIssue) => {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  });
  return errors;
}

/**
 * Exemplo de uso:
 * 
 * try {
 *   const validated = loginSchema.parse(formData);
 *   // Dados validados, seguro usar
 * } catch (error) {
 *   if (error instanceof z.ZodError) {
 *     const errors = getValidationErrors(error);
 *     // Mostrar erros ao usuário
 *   }
 * }
 */
