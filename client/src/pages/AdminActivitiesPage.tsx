import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit2, Trash2, Link as LinkIcon, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Activity {
  id: string;
  title: string;
  description: string;
  activityDate: Date | string;
  activityTime: string;
  type: string;
  inscriptionLink: string;
  createdAt: Date | string;
  tags?: Array<{ id: string; name: string; color: string }>;
}

export default function AdminActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    activityDate: string;
    activityTime: string;
    type: string;
    selectedTags: string[];
  }>({
    title: '',
    description: '',
    activityDate: '',
    activityTime: '',
    type: '',
    selectedTags: [],
  });

  const { data: activities, isLoading, refetch } = trpc.schoolActivities.getActivitiesByDateRange.useQuery({
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const { data: tags } = trpc.schoolActivities.getAllTags.useQuery();

  const createActivityMutation = trpc.schoolActivities.createActivity.useMutation({
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        activityDate: '',
        activityTime: '',
        type: '',
        selectedTags: [],
      });
    },
  });

  const updateActivityMutation = trpc.schoolActivities.updateActivity.useMutation({
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setEditingActivity(null);
    },
  });

  const deleteActivityMutation = trpc.schoolActivities.deleteActivity.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.activityDate || !formData.activityTime) {
      alert('Por favor, preencha os campos obrigatórios');
      return;
    }

    const activityDate = new Date(formData.activityDate);

    if (editingActivity) {
      updateActivityMutation.mutate({
        id: parseInt(editingActivity.id),
        title: formData.title,
        description: formData.description,
        activityDate: activityDate.toISOString(),
        startTime: formData.activityTime,
      });
    } else {
      createActivityMutation.mutate({
        title: formData.title,
        description: formData.description,
        activityDate: activityDate.toISOString(),
        startTime: formData.activityTime,
      });
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      activityDate: format(new Date(activity.activityDate), 'yyyy-MM-dd'),
      activityTime: activity.activityTime,
      type: activity.type,
      selectedTags: activity.tags?.map((t: any) => String(t.id)) || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta atividade?')) {
      deleteActivityMutation.mutate({ id: parseInt(id) });
    }
  };

  const filteredActivities = activities?.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || activity.type === selectedType;
    return matchesSearch && matchesType;
  }) || [];

  const activityTypes = ['Traveler', 'OnBusiness', 'Atividade Extra', 'Evento', 'Workshop', 'Outro'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Gerenciar Atividades</h1>
          <p className="text-slate-600">Adicione, edite e gerencie as atividades escolares</p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Buscar atividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-2"
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todos os tipos</option>
              {activityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700"
                onClick={() => {
                  setEditingActivity(null);
                  setFormData({
                    title: '',
                    description: '',
                    activityDate: '',
                    activityTime: '',
                    type: '',
                    selectedTags: [],
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Atividade
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingActivity ? 'Editar Atividade' : 'Nova Atividade'}
                </DialogTitle>
                <DialogDescription>
                  Preencha os detalhes da atividade escolar
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Título *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Aula de Traveler"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva a atividade..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Data *
                    </label>
                    <Input
                      type="date"
                      value={formData.activityDate}
                      onChange={(e) => setFormData({ ...formData, activityDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Horário *
                    </label>
                    <Input
                      type="time"
                      value={formData.activityTime}
                      onChange={(e) => setFormData({ ...formData, activityTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tipo de Atividade
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Selecione um tipo</option>
                    {activityTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tags?.map((tag: { id: number; name: string; color: string; description: string | null; createdAt: Date; updatedAt: Date }) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          const tagIdStr = String(tag.id);
                          const isSelected = formData.selectedTags.includes(tagIdStr);
                          setFormData({
                            ...formData,
                            selectedTags: isSelected
                              ? formData.selectedTags.filter(id => id !== tagIdStr)
                              : [...formData.selectedTags, tagIdStr]
                          });
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          formData.selectedTags.includes(String(tag.id))
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={createActivityMutation.isPending || updateActivityMutation.isPending}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    {(createActivityMutation.isPending || updateActivityMutation.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingActivity ? 'Atualizar' : 'Criar'} Atividade
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </CardContent>
            </Card>
          ) : filteredActivities.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-slate-500">Nenhuma atividade encontrada</p>
              </CardContent>
            </Card>
          ) : (
            filteredActivities.map(activity => (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{activity.title}</CardTitle>
                      <CardDescription>{activity.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{activity.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-600">
                        📅 {format(new Date(activity.activityDate), 'dd MMMM yyyy', { locale: ptBR })}
                      </p>
                      <p className="text-sm text-slate-600">
                        🕐 {activity.activityTime}
                      </p>
                    </div>
                    <div>
                      {activity.tags && activity.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {activity.tags.map((tag: any) => (
                            <Badge key={tag.id} variant="outline">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(activity.inscriptionLink);
                        alert('Link copiado!');
                      }}
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Copiar Link
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // TODO: Implement send to student
                        alert('Enviar para aluno - em desenvolvimento');
                      }}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar ao Aluno
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(activity)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(activity.id)}
                      disabled={deleteActivityMutation.isPending}
                    >
                      {deleteActivityMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      Deletar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
