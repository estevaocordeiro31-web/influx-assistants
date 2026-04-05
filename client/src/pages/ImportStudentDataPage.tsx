import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

interface GradeEntry {
  semester: number;
  grade: number;
  period: string;
}

interface AttendanceEntry {
  semester: number;
  rate: number;
  absences: number;
  period: string;
}

export default function ImportStudentDataPage() {
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    studentName: 'Laís Milena Gambini',
    matricula: '6200',
    book: 'Book 4',
    className: '',
    schedule: '',
    teacher: '',
    notes: '',
  });

  const [grades, setGrades] = useState<GradeEntry[]>([
    { semester: 1, grade: 8.5, period: '2024-01' },
  ]);

  const [attendance, setAttendance] = useState<AttendanceEntry[]>([
    { semester: 1, rate: 95, absences: 2, period: '2024-01' },
  ]);

  if (!user) {
    return null;
  }

  const addGrade = () => {
    setGrades([...grades, { semester: grades.length + 1, grade: 0, period: '' }]);
  };

  const removeGrade = (index: number) => {
    setGrades(grades.filter((_, i) => i !== index));
  };

  const addAttendance = () => {
    setAttendance([...attendance, { semester: attendance.length + 1, rate: 0, absences: 0, period: '' }]);
  };

  const removeAttendance = (index: number) => {
    setAttendance(attendance.filter((_, i) => i !== index));
  };

  const handleExport = () => {
    const data = {
      student: formData,
      grades,
      attendance,
    };

    // Criar um documento HTML para visualizar
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de ${formData.studentName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
          .section { margin-bottom: 30px; }
          .section h2 { color: #007bff; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #007bff; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px; }
          .info-box { background: #f5f5f5; padding: 15px; border-radius: 5px; }
          .label { font-weight: bold; color: #555; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${formData.studentName}</h1>
          <p>Matrícula: ${formData.matricula} | ${formData.book}</p>
        </div>

        <div class="section">
          <h2>Informações Gerais</h2>
          <div class="info-grid">
            <div class="info-box">
              <div class="label">Turma:</div>
              <p>${formData.className || 'N/A'}</p>
            </div>
            <div class="info-box">
              <div class="label">Horário:</div>
              <p>${formData.schedule || 'N/A'}</p>
            </div>
            <div class="info-box">
              <div class="label">Professor:</div>
              <p>${formData.teacher || 'N/A'}</p>
            </div>
            <div class="info-box">
              <div class="label">Média Geral:</div>
              <p>${(grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Notas por Semestre</h2>
          <table>
            <thead>
              <tr>
                <th>Semestre</th>
                <th>Nota</th>
                <th>Período</th>
              </tr>
            </thead>
            <tbody>
              ${grades.map(g => `
                <tr>
                  <td>${g.semester}</td>
                  <td>${g.grade}</td>
                  <td>${g.period}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Frequência por Semestre</h2>
          <table>
            <thead>
              <tr>
                <th>Semestre</th>
                <th>Taxa de Frequência</th>
                <th>Ausências</th>
                <th>Período</th>
              </tr>
            </thead>
            <tbody>
              ${attendance.map(a => `
                <tr>
                  <td>${a.semester}</td>
                  <td>${a.rate}%</td>
                  <td>${a.absences}</td>
                  <td>${a.period}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${formData.notes ? `
          <div class="section">
            <h2>Observações</h2>
            <p>${formData.notes}</p>
          </div>
        ` : ''}
      </body>
      </html>
    `;

    // Abrir em nova aba para imprimir/salvar como PDF
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
      setTimeout(() => newWindow.print(), 500);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Importar Dados de Aluno</h1>
          <p className="text-muted-foreground mt-2">
            Adicione as informações do aluno (turma, horário, notas, presença)
          </p>
        </div>

        {/* Informações Gerais */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Nome do Aluno</label>
                <Input
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="Nome"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Matrícula</label>
                <Input
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  placeholder="Matrícula"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Book/Nível</label>
                <Input
                  value={formData.book}
                  onChange={(e) => setFormData({ ...formData, book: e.target.value })}
                  placeholder="Book 4"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Turma</label>
                <Input
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  placeholder="Ex: Turma A"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Horário</label>
                <Input
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  placeholder="Ex: 19:00 - 20:30"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Professor</label>
                <Input
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  placeholder="Nome do professor"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold">Observações</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Adicione observações sobre o aluno..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notas */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Notas por Semestre</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={addGrade}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Semestre
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {grades.map((grade, idx) => (
                <div key={idx} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-semibold">Semestre</label>
                    <Input
                      type="number"
                      value={grade.semester}
                      onChange={(e) => {
                        const newGrades = [...grades];
                        newGrades[idx].semester = parseInt(e.target.value);
                        setGrades(newGrades);
                      }}
                      min="1"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-semibold">Nota (0-10)</label>
                    <Input
                      type="number"
                      value={grade.grade}
                      onChange={(e) => {
                        const newGrades = [...grades];
                        newGrades[idx].grade = parseFloat(e.target.value);
                        setGrades(newGrades);
                      }}
                      min="0"
                      max="10"
                      step="0.5"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-semibold">Período</label>
                    <Input
                      value={grade.period}
                      onChange={(e) => {
                        const newGrades = [...grades];
                        newGrades[idx].period = e.target.value;
                        setGrades(newGrades);
                      }}
                      placeholder="2024-01"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeGrade(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Frequência */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Frequência por Semestre</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={addAttendance}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Semestre
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendance.map((att, idx) => (
                <div key={idx} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-semibold">Semestre</label>
                    <Input
                      type="number"
                      value={att.semester}
                      onChange={(e) => {
                        const newAtt = [...attendance];
                        newAtt[idx].semester = parseInt(e.target.value);
                        setAttendance(newAtt);
                      }}
                      min="1"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-semibold">Taxa (%)</label>
                    <Input
                      type="number"
                      value={att.rate}
                      onChange={(e) => {
                        const newAtt = [...attendance];
                        newAtt[idx].rate = parseInt(e.target.value);
                        setAttendance(newAtt);
                      }}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-semibold">Ausências</label>
                    <Input
                      type="number"
                      value={att.absences}
                      onChange={(e) => {
                        const newAtt = [...attendance];
                        newAtt[idx].absences = parseInt(e.target.value);
                        setAttendance(newAtt);
                      }}
                      min="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-semibold">Período</label>
                    <Input
                      value={att.period}
                      onChange={(e) => {
                        const newAtt = [...attendance];
                        newAtt[idx].period = e.target.value;
                        setAttendance(newAtt);
                      }}
                      placeholder="2024-01"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeAttendance(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex gap-4">
          <Button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            📄 Gerar Relatório (Imprimir/PDF)
          </Button>
          <Button
            variant="outline"
            onClick={() => setLocation('/admin')}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
