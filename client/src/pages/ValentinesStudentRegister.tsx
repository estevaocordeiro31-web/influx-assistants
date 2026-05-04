import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Phone, BookOpen, User, Loader2, CheckCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const EVENT_ID = 'valentines-2026';

export default function ValentinesStudentRegister() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    book: '',
    whatsapp: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const joinAsGuestMutation = trpc.culturalEvents.joinAsGuest.useMutation();

  // Validação de telefone brasileiro
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11 || cleaned.length === 10;
  };

  // Formatação de telefone
  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, whatsapp: formatted }));
    if (errors.whatsapp) {
      setErrors(prev => ({ ...prev, whatsapp: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.book.trim()) {
      newErrors.book = 'Selecione um livro';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
    } else if (!validatePhone(formData.whatsapp)) {
      newErrors.whatsapp = 'Telefone inválido (use formato: (11) 99999-9999)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await joinAsGuestMutation.mutateAsync({
        eventId: EVENT_ID,
        name: formData.name.trim(),
        whatsapp: formData.whatsapp.replace(/\D/g, ''),
      });

      setShowSuccess(true);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate(`/events/valentines?participantId=${result.participantId}&token=${result.token}`);
      }, 2000);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Erro ao registrar. Tente novamente.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: "linear-gradient(160deg, #1a0011 0%, #2d0a1e 30%, #1a0011 60%, #0d0008 100%)",
      }}>
        <div className="max-w-sm mx-auto px-4 text-center">
          <div className="mb-6 animate-bounce">
            <CheckCircle size={64} className="text-green-400 mx-auto" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Cadastro Realizado!</h2>
          <p className="text-pink-300/60 mb-4">Bem-vindo ao inFlux Restaurant 🎉</p>
          <p className="text-pink-300/40 text-sm">Redirecionando para a atividade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: "linear-gradient(160deg, #1a0011 0%, #2d0a1e 30%, #1a0011 60%, #0d0008 100%)",
    }}>
      <div className="relative z-10 max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate("/events/valentines/totem")}
          className="mb-6 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <ArrowLeft size={18} className="text-white/70" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Heart size={28} className="text-pink-400 fill-pink-400" />
            <h1 className="text-3xl font-black text-white">Cadastro</h1>
            <Heart size={28} className="text-pink-400 fill-pink-400" />
          </div>
          <p className="text-pink-300/60 text-sm">Preencha seus dados para participar</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-white text-sm font-bold mb-2 flex items-center gap-2">
              <User size={16} className="text-pink-400" />
              Seu Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder="Digite seu nome completo"
              className="w-full rounded-xl px-4 py-3 text-white text-sm font-bold"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: errors.name ? "1px solid #f44336" : "1px solid rgba(255,255,255,0.1)",
                outline: "none",
              }}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Livro */}
          <div>
            <label className="block text-white text-sm font-bold mb-2 flex items-center gap-2">
              <BookOpen size={16} className="text-pink-400" />
              Qual livro você está estudando?
            </label>
            <select
              value={formData.book}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, book: e.target.value }));
                if (errors.book) setErrors(prev => ({ ...prev, book: '' }));
              }}
              className="w-full rounded-xl px-4 py-3 text-white text-sm font-bold"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: errors.book ? "1px solid #f44336" : "1px solid rgba(255,255,255,0.1)",
                outline: "none",
                color: formData.book ? "white" : "rgba(255,255,255,0.5)",
              }}
              disabled={isSubmitting}
            >
              <option value="">Selecione um livro...</option>
              <option value="book1">Book 1</option>
              <option value="book2">Book 2</option>
              <option value="book3">Book 3</option>
              <option value="book4">Book 4</option>
              <option value="book5">Book 5</option>
              <option value="book6">Book 6</option>
              <option value="book7">Book 7</option>
              <option value="book8">Book 8</option>
              <option value="vacation">Vacation Plus</option>
              <option value="outro">Outro</option>
            </select>
            {errors.book && (
              <p className="text-red-400 text-xs mt-1">{errors.book}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-white text-sm font-bold mb-2 flex items-center gap-2">
              <Phone size={16} className="text-pink-400" />
              WhatsApp
            </label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999"
              className="w-full rounded-xl px-4 py-3 text-white text-sm font-bold"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: errors.whatsapp ? "1px solid #f44336" : "1px solid rgba(255,255,255,0.1)",
                outline: "none",
              }}
              disabled={isSubmitting}
            />
            {errors.whatsapp && (
              <p className="text-red-400 text-xs mt-1">{errors.whatsapp}</p>
            )}
            <p className="text-pink-300/40 text-xs mt-1">Usaremos para entrar em contato depois</p>
          </div>

          {/* Erro geral */}
          {errors.submit && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-xs">{errors.submit}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl gap-2 py-3 mt-6"
            style={{
              background: isSubmitting ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #ff1493, #ff69b4)",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <Heart size={18} />
                Começar Agora
              </>
            )}
          </Button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 rounded-xl" style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <p className="text-pink-300/60 text-xs text-center">
            ✨ Após o cadastro, você terá acesso a todas as missões e poderá competir no ranking!
          </p>
        </div>
      </div>
    </div>
  );
}
