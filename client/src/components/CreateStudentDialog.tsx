import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { createStudentSchema, getValidationErrors } from '@shared/validation-schemas';
import { z } from 'zod';

interface CreateStudentDialogProps {
  onSuccess?: () => void;
}

export function CreateStudentDialog({ onSuccess }: CreateStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    level: 'beginner' as const,
    objective: 'career' as const,
    phone: '',
  });

  // Mutation para criar aluno
  const createStudentMutation = trpc.adminStudents.createStudent.useMutation({
    onSuccess: () => {
      toast.success('Aluno criado com sucesso!');
      setFormData({ name: '', email: '', level: 'beginner', objective: 'career', phone: '' });
      setErrors({});
      setOpen(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar aluno: ${error.message}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpar erro do campo quando usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validar com Zod
      const validatedData = createStudentSchema.parse({
        name: formData.name,
        email: formData.email,
        level: formData.level,
        objective: formData.objective,
        phone: formData.phone || undefined,
      });

      // Enviar para servidor
      await createStudentMutation.mutateAsync(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = getValidationErrors(error);
        setErrors(validationErrors);
        toast.error('Por favor, corrija os erros no formulário');
      } else {
        toast.error('Erro ao criar aluno');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Aluno
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Aluno</DialogTitle>
          <DialogDescription>
            Preencha os dados do aluno para adicioná-lo à plataforma
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome *</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: João Silva"
              disabled={isLoading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email *</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ex: joao@example.com"
              disabled={isLoading}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </div>
            )}
          </div>

          {/* Nível */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nível *</label>
            <Select value={formData.level} onValueChange={(value) => handleSelectChange('level', value)}>
              <SelectTrigger className={errors.level ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Iniciante</SelectItem>
                <SelectItem value="elementary">Elementar</SelectItem>
                <SelectItem value="intermediate">Intermediário</SelectItem>
                <SelectItem value="upper_intermediate">Intermediário Superior</SelectItem>
                <SelectItem value="advanced">Avançado</SelectItem>
                <SelectItem value="proficient">Proficiente</SelectItem>
              </SelectContent>
            </Select>
            {errors.level && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.level}
              </div>
            )}
          </div>

          {/* Objetivo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Objetivo *</label>
            <Select value={formData.objective} onValueChange={(value) => handleSelectChange('objective', value)}>
              <SelectTrigger className={errors.objective ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="career">Carreira</SelectItem>
                <SelectItem value="travel">Viagens</SelectItem>
                <SelectItem value="studies">Estudos</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
            {errors.objective && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.objective}
              </div>
            )}
          </div>

          {/* Telefone (opcional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefone (opcional)</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Ex: (11) 98765-4321"
              disabled={isLoading}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 gap-2">
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Criando...' : 'Criar Aluno'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
