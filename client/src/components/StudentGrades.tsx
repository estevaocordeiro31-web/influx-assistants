import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, CheckCircle2, XCircle, Clock, TrendingUp, 
  Award, BarChart3, Calendar, AlertTriangle
} from "lucide-react";

interface Grade {
  id: string;
  subject: string;
  type: "quiz" | "test" | "homework" | "participation" | "speaking";
  score: number;
  maxScore: number;
  date: Date;
  unit?: string;
  feedback?: string;
}

interface AttendanceRecord {
  date: Date;
  status: "present" | "absent" | "late" | "justified";
  classType: string;
}

const GRADE_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  quiz: { label: "Quiz", color: "text-blue-400" },
  test: { label: "Prova", color: "text-purple-400" },
  homework: { label: "Homework", color: "text-green-400" },
  participation: { label: "Participação", color: "text-yellow-400" },
  speaking: { label: "Speaking", color: "text-cyan-400" },
};

function generateDemoGrades(): Grade[] {
  return [
    { id: "g1", subject: "Unit 1 - Greetings", type: "quiz", score: 92, maxScore: 100, date: new Date(2026, 0, 15), unit: "Unit 1", feedback: "Excelente! Dominou os chunks de saudações." },
    { id: "g2", subject: "Unit 2 - Daily Routine", type: "quiz", score: 85, maxScore: 100, date: new Date(2026, 0, 22), unit: "Unit 2", feedback: "Bom trabalho! Revisar connected speech." },
    { id: "g3", subject: "Units 1-2 Review", type: "test", score: 88, maxScore: 100, date: new Date(2026, 0, 29), unit: "Units 1-2", feedback: "Ótima prova! Atenção ao uso de preposições." },
    { id: "g4", subject: "Unit 3 - Eating Out", type: "quiz", score: 78, maxScore: 100, date: new Date(2026, 1, 5), unit: "Unit 3", feedback: "Precisa praticar mais vocabulário de restaurante." },
    { id: "g5", subject: "Homework - Units 1-3", type: "homework", score: 95, maxScore: 100, date: new Date(2026, 1, 7), feedback: "Homework completo e bem feito!" },
    { id: "g6", subject: "Classroom Participation", type: "participation", score: 90, maxScore: 100, date: new Date(2026, 1, 8), feedback: "Participação ativa e engajada." },
    { id: "g7", subject: "Speaking Assessment", type: "speaking", score: 82, maxScore: 100, date: new Date(2026, 1, 9), feedback: "Boa fluência. Trabalhar pronúncia de 'th' sounds." },
  ];
}

function generateDemoAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const now = new Date();
  
  for (let i = 0; i < 20; i++) {
    const date = new Date(now.getTime() - i * 3.5 * 24 * 60 * 60 * 1000);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue;
    
    let status: AttendanceRecord["status"] = "present";
    if (i === 5) status = "absent";
    if (i === 8) status = "late";
    if (i === 12) status = "justified";
    
    records.push({
      date,
      status,
      classType: dow === 2 ? "Conversation" : dow === 4 ? "Grammar & Practice" : "Extra",
    });
  }
  
  return records;
}

const ATTENDANCE_CONFIG = {
  present: { icon: CheckCircle2, color: "text-green-400", bgColor: "bg-green-500/20", label: "Presente" },
  absent: { icon: XCircle, color: "text-red-400", bgColor: "bg-red-500/20", label: "Ausente" },
  late: { icon: Clock, color: "text-yellow-400", bgColor: "bg-yellow-500/20", label: "Atrasado" },
  justified: { icon: AlertTriangle, color: "text-blue-400", bgColor: "bg-blue-500/20", label: "Justificado" },
};

interface StudentGradesProps {
  studentName?: string;
}

export function StudentGrades({ studentName }: StudentGradesProps) {
  const [activeTab, setActiveTab] = useState<"grades" | "attendance">("grades");
  
  const grades = useMemo(() => generateDemoGrades(), []);
  const attendance = useMemo(() => generateDemoAttendance(), []);
  
  // Estatísticas de notas
  const gradeStats = useMemo(() => {
    const avg = grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length;
    const highest = Math.max(...grades.map(g => (g.score / g.maxScore) * 100));
    const lowest = Math.min(...grades.map(g => (g.score / g.maxScore) * 100));
    return { avg: Math.round(avg), highest: Math.round(highest), lowest: Math.round(lowest) };
  }, [grades]);
  
  // Estatísticas de presença
  const attendanceStats = useMemo(() => {
    const total = attendance.length;
    const present = attendance.filter(a => a.status === "present").length;
    const absent = attendance.filter(a => a.status === "absent").length;
    const late = attendance.filter(a => a.status === "late").length;
    const justified = attendance.filter(a => a.status === "justified").length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, late, justified, rate };
  }, [attendance]);
  
  const getScoreColor = (score: number, max: number) => {
    const pct = (score / max) * 100;
    if (pct >= 90) return "text-green-400";
    if (pct >= 75) return "text-blue-400";
    if (pct >= 60) return "text-yellow-400";
    return "text-red-400";
  };
  
  const getScoreBg = (score: number, max: number) => {
    const pct = (score / max) * 100;
    if (pct >= 90) return "bg-green-500";
    if (pct >= 75) return "bg-blue-500";
    if (pct >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-4">
      {/* Header com toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-purple-400" />
          Notas & Presença
        </h2>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab("grades")}
            className={activeTab === "grades" ? "bg-purple-500/20 border-purple-500/50 text-purple-400" : "border-slate-600 text-slate-400"}
          >
            <Award className="w-3 h-3 mr-1" /> Notas
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab("attendance")}
            className={activeTab === "attendance" ? "bg-purple-500/20 border-purple-500/50 text-purple-400" : "border-slate-600 text-slate-400"}
          >
            <Calendar className="w-3 h-3 mr-1" /> Presença
          </Button>
        </div>
      </div>

      {activeTab === "grades" ? (
        <div className="space-y-4">
          {/* Cards de estatísticas */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3 text-center">
                <p className="text-[10px] sm:text-xs text-slate-500">Média Geral</p>
                <p className={`text-xl sm:text-2xl font-bold ${getScoreColor(gradeStats.avg, 100)}`}>{gradeStats.avg}%</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3 text-center">
                <p className="text-[10px] sm:text-xs text-slate-500">Maior Nota</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">{gradeStats.highest}%</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3 text-center">
                <p className="text-[10px] sm:text-xs text-slate-500">Menor Nota</p>
                <p className={`text-xl sm:text-2xl font-bold ${getScoreColor(gradeStats.lowest, 100)}`}>{gradeStats.lowest}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de notas */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="p-3 sm:p-4 pb-2">
              <CardTitle className="text-sm sm:text-base text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                Histórico de Notas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 pt-0">
              <div className="space-y-2">
                {grades.map(grade => {
                  const pct = Math.round((grade.score / grade.maxScore) * 100);
                  const typeConfig = GRADE_TYPE_CONFIG[grade.type];
                  return (
                    <div key={grade.id} className="p-2 sm:p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge variant="outline" className={`text-[10px] shrink-0 ${typeConfig.color} border-current/30`}>
                            {typeConfig.label}
                          </Badge>
                          <span className="text-xs sm:text-sm text-white truncate">{grade.subject}</span>
                        </div>
                        <span className={`text-sm sm:text-base font-bold shrink-0 ml-2 ${getScoreColor(grade.score, grade.maxScore)}`}>
                          {grade.score}/{grade.maxScore}
                        </span>
                      </div>
                      <Progress value={pct} className="h-1.5 mb-1" />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">
                          {grade.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                          {grade.unit && ` • ${grade.unit}`}
                        </span>
                        {grade.feedback && (
                          <span className="text-[10px] text-slate-400 italic truncate ml-2 max-w-[200px]">
                            "{grade.feedback}"
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Cards de estatísticas de presença */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3 text-center">
                <p className="text-[10px] sm:text-xs text-slate-500">Frequência</p>
                <p className={`text-xl sm:text-2xl font-bold ${attendanceStats.rate >= 75 ? "text-green-400" : "text-red-400"}`}>
                  {attendanceStats.rate}%
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3 text-center">
                <p className="text-[10px] sm:text-xs text-slate-500">Presenças</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">{attendanceStats.present}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3 text-center">
                <p className="text-[10px] sm:text-xs text-slate-500">Faltas</p>
                <p className="text-xl sm:text-2xl font-bold text-red-400">{attendanceStats.absent}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-3 text-center">
                <p className="text-[10px] sm:text-xs text-slate-500">Atrasos</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-400">{attendanceStats.late}</p>
              </CardContent>
            </Card>
          </div>

          {/* Barra de frequência visual */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="p-3 sm:p-4 pb-2">
              <CardTitle className="text-sm sm:text-base text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Registro de Presença
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 pt-0">
              {/* Grid visual de presença */}
              <div className="flex flex-wrap gap-1 mb-3">
                {attendance.map((record, i) => {
                  const config = ATTENDANCE_CONFIG[record.status];
                  return (
                    <div
                      key={i}
                      title={`${record.date.toLocaleDateString("pt-BR")} - ${config.label} (${record.classType})`}
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center ${config.bgColor} cursor-default`}
                    >
                      {(() => {
                        const Icon = config.icon;
                        return <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${config.color}`} />;
                      })()}
                    </div>
                  );
                })}
              </div>
              
              {/* Legenda */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-700">
                {Object.entries(ATTENDANCE_CONFIG).map(([status, config]) => (
                  <div key={status} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded ${config.bgColor} flex items-center justify-center`}>
                      {(() => {
                        const Icon = config.icon;
                        return <Icon className={`w-2 h-2 ${config.color}`} />;
                      })()}
                    </div>
                    <span className="text-[10px] sm:text-xs text-slate-500">{config.label}</span>
                  </div>
                ))}
              </div>

              {/* Lista detalhada */}
              <div className="space-y-1 mt-3 max-h-60 overflow-y-auto">
                {attendance.slice(0, 10).map((record, i) => {
                  const config = ATTENDANCE_CONFIG[record.status];
                  const Icon = config.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 p-1.5 sm:p-2 rounded bg-slate-900/30">
                      <Icon className={`w-4 h-4 ${config.color} shrink-0`} />
                      <span className="text-xs text-slate-300 flex-1">{record.classType}</span>
                      <span className="text-[10px] text-slate-500">
                        {record.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                      </span>
                      <Badge variant="outline" className={`text-[10px] ${config.color} border-current/30`}>
                        {config.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
