import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Plane, Briefcase, GraduationCap, Check, Palmtree } from 'lucide-react';


const COURSE_ICONS: Record<string, any> = {
  vp1: Palmtree,
  vp2: Palmtree,
  vp3: Palmtree,
  vp4: Palmtree,
  traveler: Plane,
  on_business: Briefcase,
  reading_club: BookOpen,
};

const COURSE_COLORS: Record<string, string> = {
  vp1: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  vp2: 'bg-blue-50 border-blue-200 text-blue-700',
  vp3: 'bg-purple-50 border-purple-200 text-purple-700',
  vp4: 'bg-orange-50 border-orange-200 text-orange-700',
  traveler: 'bg-sky-50 border-sky-200 text-sky-700',
  on_business: 'bg-slate-50 border-slate-200 text-slate-700',
  reading_club: 'bg-amber-50 border-amber-200 text-amber-700',
};

const AVAILABLE_COURSES = [
  { code: 'vp1', name: 'Vacation Plus 1', category: 'Vacation Plus', description: 'Programa de férias imersivo - Nível 1' },
  { code: 'vp2', name: 'Vacation Plus 2', category: 'Vacation Plus', description: 'Programa de férias imersivo - Nível 2' },
  { code: 'vp3', name: 'Vacation Plus 3', category: 'Vacation Plus', description: 'Programa de férias imersivo - Nível 3' },
  { code: 'vp4', name: 'Vacation Plus 4', category: 'Vacation Plus', description: 'Programa de férias imersivo - Nível 4' },
  { code: 'traveler', name: 'Traveler', category: 'Cursos Especiais', description: 'Inglês para viajantes' },
  { code: 'on_business', name: 'On Business', category: 'Cursos Especiais', description: 'Inglês para negócios' },
  { code: 'reading_club', name: 'Reading Club', category: 'Clubes', description: 'Clube de leitura em inglês' },
];

interface StudentCoursesManagerProps {
  studentId: number;
  studentName?: string;
}

export function StudentCoursesManager({ studentId, studentName }: StudentCoursesManagerProps) {
  const [courseStates, setCourseStates] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const { data: enrolledCourses, isLoading } = trpc.studentCourses.getStudentCourses.useQuery(
    { studentId },
    { enabled: !!studentId }
  );

  const updateMutation = trpc.studentCourses.updateStudentCourses.useMutation({
    onSuccess: () => {
      setHasChanges(false);
      setSaveMessage('Cursos atualizados com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    },
    onError: (error) => {
      setSaveMessage(`Erro: ${error.message}`);
      setTimeout(() => setSaveMessage(''), 5000);
    },
  });

  useEffect(() => {
    if (enrolledCourses) {
      const states: Record<string, boolean> = {};
      AVAILABLE_COURSES.forEach((c) => {
        const enrolled = enrolledCourses.find((e) => e.courseCode === c.code);
        states[c.code] = enrolled ? enrolled.isActive : false;
      });
      setCourseStates(states);
    }
  }, [enrolledCourses]);

  const toggleCourse = (code: string) => {
    setCourseStates((prev) => {
      const newStates = { ...prev, [code]: !prev[code] };
      setHasChanges(true);
      return newStates;
    });
  };

  const handleSave = () => {
    const courses = AVAILABLE_COURSES.map((c) => ({
      courseCode: c.code,
      courseName: c.name,
      isActive: courseStates[c.code] || false,
    }));
    updateMutation.mutate({ studentId, courses });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Group courses by category
  const grouped = AVAILABLE_COURSES.reduce((acc, course) => {
    if (!acc[course.category]) acc[course.category] = [];
    acc[course.category].push(course);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_COURSES>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Cursos Extras
        </CardTitle>
        <CardDescription>
          Gerencie os cursos extras que {studentName || 'o aluno'} tem acesso. Ative ou desative cada curso conforme necessário.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(grouped).map(([category, courses]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {category}
            </h3>
            <div className="space-y-2">
              {courses.map((course) => {
                const Icon = COURSE_ICONS[course.code] || BookOpen;
                const colorClass = COURSE_COLORS[course.code] || 'bg-gray-50 border-gray-200 text-gray-700';
                const isActive = courseStates[course.code] || false;

                return (
                  <div
                    key={course.code}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      isActive ? colorClass : 'bg-gray-50/50 border-gray-100 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${isActive ? 'bg-white/60' : 'bg-gray-100'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${isActive ? '' : 'text-gray-400'}`}>
                          {course.name}
                        </p>
                        <p className={`text-xs ${isActive ? 'opacity-70' : 'text-gray-300'}`}>
                          {course.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/60">
                          Ativo
                        </span>
                      )}
                      <Switch
                        checked={isActive}
                        onCheckedChange={() => toggleCourse(course.code)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {saveMessage && (
          <div className={`text-sm font-medium px-3 py-2 rounded-md ${saveMessage.startsWith('Erro') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {saveMessage}
          </div>
        )}

        {hasChanges && (
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="gap-2"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Salvar Alterações
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
