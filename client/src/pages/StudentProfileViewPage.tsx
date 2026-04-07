import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { StudentProfileDetails } from '@/components/StudentProfileDetails';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

interface StudentProfileViewPageProps {
  params: {
    studentId: string;
  };
}

export default function StudentProfileViewPage({ params }: StudentProfileViewPageProps) {
  const [, setLocation] = useLocation();
  const studentId = parseInt(params.studentId);

  // Buscar dados do aluno
  const { data: studentData, isLoading: isLoadingStudent } = trpc.adminStudents.getStudents.useQuery({
    limit: 100,
  });

  // Buscar perfil detalhado
  const { data: profileData, isLoading: isLoadingProfile } = trpc.studentProfile.getDetailedProfile.useQuery(
    { studentId },
    { enabled: !!studentId }
  );

  // Buscar dados do Sponte
  const { data: sponteData, isLoading: isLoadingSponteData } = trpc.sponteData.getStudentData.useQuery(
    { studentId },
    { enabled: !!studentId }
  );

  const student = studentData?.students?.find((s) => s.id === studentId);

  if (isLoadingStudent || isLoadingProfile || isLoadingSponteData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Carregando perfil do aluno...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => setLocation('/admin')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Aluno não encontrado</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const levelMap: Record<string, string> = {
    beginner: 'Iniciante',
    elementary: 'Elementar',
    intermediate: 'Intermediário',
    upper_intermediate: 'Intermediário Superior',
    advanced: 'Avançado',
    proficient: 'Proficiente',
  };

  const objectiveMap: Record<string, string> = {
    career: 'Carreira',
    travel: 'Viagens',
    studies: 'Estudos',
    other: 'Outro',
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => setLocation('/admin')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{student.name}</h1>
            <p className="text-muted-foreground">{student.email}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nível</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{levelMap[student.level] || student.level}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Objetivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{objectiveMap[student.objective] || student.objective}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Horas Aprendidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.hoursLearned}h</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.streakDays}d</div>
            </CardContent>
          </Card>
        </div>

        {/* Perfil Detalhado */}
        {profileData && profileData.success && profileData.profile && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Informações Detalhadas do Aluno</CardTitle>
              <CardDescription>Dados coletados sobre objetivos, áreas de conforto e desconforto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Tempo de Estudo</h3>
                  <p className="text-muted-foreground">
                    {profileData.profile.studyDurationYears} anos e {profileData.profile.studyDurationMonths} meses
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Objetivos</h3>
                  <p className="text-muted-foreground">{profileData.profile.specificGoals || 'Nao informado'}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Áreas de Desconforto</h3>
                  <p className="text-muted-foreground">{profileData.profile.discomfortAreas || 'Nao informado'}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Áreas de Conforto</h3>
                  <p className="text-muted-foreground">{profileData.profile.comfortAreas || 'Nao informado'}</p>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">Áreas de Melhoria</h3>
                  <p className="text-muted-foreground">{profileData.profile.improvementAreas || 'Nao informado'}</p>
                </div>

                {profileData.profile.englishConsumptionSources && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-2">Fontes de Consumo de Ingles</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(profileData.profile.englishConsumptionSources).map(([source, selected]) =>
                        selected ? (
                          <span
                            key={source}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {source}
                          </span>
                        ) : null
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dados do Sponte */}
        {sponteData && sponteData.success && sponteData.data && (
          <StudentProfileDetails
            studentName={student.name}
            studentEmail={student.email}
            attendanceRate={sponteData.data.attendance.percentage}
            totalClasses={sponteData.data.attendance.total}
            attendedClasses={sponteData.data.attendance.present}
            missedClasses={sponteData.data.attendance.absent}
            averageGrade={sponteData.data.evaluations.average}
            latestGrade={sponteData.data.evaluations.lastScore}
            gradeTrend={sponteData.data.evaluations.trend}
            totalAbsences={sponteData.data.absences.total}
            justifiedAbsences={sponteData.data.absences.justified}
            unjustifiedAbsences={sponteData.data.absences.unjustified}
          />
        )}

        {/* Botões de Ação */}
        <div className="flex gap-2 mt-8">
          <Button
            onClick={() => setLocation(`/admin/student/${studentId}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Editar Perfil
          </Button>
          <Button variant="outline" onClick={() => setLocation('/admin')}>
            Voltar
          </Button>
        </div>
      </main>
    </div>
  );
}
