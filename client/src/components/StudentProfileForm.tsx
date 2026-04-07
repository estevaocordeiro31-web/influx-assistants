import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface StudentProfileFormProps {
  studentId: number;
  onSuccess?: () => void;
}

export function StudentProfileForm({ studentId, onSuccess }: StudentProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    studyDurationYears: '',
    studyDurationMonths: '',
    specificGoals: '',
    discomfortAreas: '',
    comfortAreas: '',
    englishConsumptionSources: {
      music: false,
      series: false,
      movies: false,
      socialMedia: false,
      podcasts: false,
      books: false,
      news: false,
      other: false,
    },
    improvementAreas: '',
  });

  const updateProfileMutation = trpc.studentProfile.updateDetailedProfile.useMutation({
    onSuccess: () => {
      toast.success('Perfil atualizado com sucesso!');
      setSubmitted(true);
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const consumptionSources = Object.entries(formData.englishConsumptionSources)
        .filter(([, value]) => value)
        .map(([key]) => key);

      await updateProfileMutation.mutateAsync({
        studentId,
        studyDurationYears: formData.studyDurationYears ? parseFloat(formData.studyDurationYears) : undefined,
        studyDurationMonths: formData.studyDurationMonths ? parseInt(formData.studyDurationMonths) : undefined,
        specificGoals: formData.specificGoals || undefined,
        discomfortAreas: formData.discomfortAreas || undefined,
        comfortAreas: formData.comfortAreas || undefined,
        englishConsumptionSources: consumptionSources,
        improvementAreas: formData.improvementAreas || undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">