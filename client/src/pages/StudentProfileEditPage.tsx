import { useAuth } from '@/_core/hooks/useAuth';
import { StudentProfileForm } from '@/components/StudentProfileForm';
import { StudentCoursesManager } from '@/components/StudentCoursesManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';

export default function StudentProfileEditPage({ params }: any) {
  const studentId = params?.studentId;
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();
  const [parsedStudentId, setParsedStudentId] = useState<number | null>(null);

  useEffect(() => {
    if (studentId) {
      setParsedStudentId(parseInt(studentId, 10));
    }
  }, [studentId]);

  const { data: profileData, isLoading } = trpc.studentProfile.getDetailedProfile.useQuery(
    { studentId: parsedStudentId || 0 },
    { enabled: !!parsedStudentId }
  );

  if (!user) {
    return null;
  }

  if (!parsedStudentId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Aluno não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/admin')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Editar Perfil do Aluno</h1>
            <p className="text-sm text-muted-foreground">
              Colete informações detalhadas sobre as necessidades do aluno
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <Card>
            <CardContent className="pt-6 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <StudentProfileForm
              studentId={parsedStudentId}
              onSuccess={() => {
                setLocation('/admin');
              }}
            />
            <StudentCoursesManager
              studentId={parsedStudentId}
              studentName={''}
            />
          </div>
        )}
      </main>
    </div>
  );
}
