import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Edit2, Trash2, Link as LinkIcon, Send, ChevronLeft, Calendar, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLocation } from 'wouter';

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

// Glass button component
function GlassButton({ children, onClick, disabled, variant = 'default', size = 'md', style: extraStyle, ...props }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'danger';
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
  [key: string]: any;
}) {
  const colors = {
    default: { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', hover: 'rgba(255,255,255,0.08)' },
    primary: { bg: 'rgba(77,168,255,0.1)', border: 'rgba(77,168,255,0.2)', color: '#4da8ff', hover: 'rgba(77,168,255,0.18)' },
    danger: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)', color: '#ef4444', hover: 'rgba(239,68,68,0.15)' },
  };
  const c = colors[variant];
  const pad = size === 'sm' ? '6px 12px' : '10px 18px';
  const fontSize = size === 'sm' ? '0.8rem' : '0.875rem';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: pad, borderRadius: 10, background: c.bg, border: `1px solid ${c.border}`,
        color: c.color, fontSize, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
        opacity: disabled ? 0.5 : 1, ...extraStyle,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = c.hover; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = c.bg; }}
      {...props}
    >
      {children}
    </button>
  );
}

export default function AdminActivitiesPage() {
  const [, setLocation] = useLocation();
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
      setFormData({ title: '', description: '', activityDate: '', activityTime: '', type: '', selectedTags: [] });
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
    onSuccess: () => { refetch(); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.activityDate || !formData.activityTime) {
      alert('Por favor, preencha os campos obrigatorios');
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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 12,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff', fontSize: '0.875rem', outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.8rem', fontWeight: 500,
    color: 'rgba(255,255,255,0.5)', marginBottom: 6,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #06090f 0%, #0c1222 40%, #111827 100%)',
      fontFamily: "'DM Sans', sans-serif",
      padding: '24px 16px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Back */}
        <button
          onClick={() => setLocation('/admin/dashboard')}
          style={{
            display: 'flex', alignItems: 'center', gap: 4, background: 'none',
            border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem',
            cursor: 'pointer', marginBottom: 24, padding: 0,
          }}
        >
          <ChevronLeft size={16} /> Dashboard
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.6rem', color: '#fff', margin: '0 0 6px' }}>
            Gerenciar Atividades
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', margin: 0 }}>
            Adicione, edite e gerencie as atividades escolares
          </p>
        </div>

        {/* Filters */}
        <div style={{
          borderRadius: 16, padding: '16px 18px', marginBottom: 16,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <input
            placeholder="Buscar atividades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, flex: '1 1 200px' }}
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ ...inputStyle, flex: '0 1 200px', cursor: 'pointer' }}
          >
            <option value="">Todos os tipos</option>
            {activityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <GlassButton
                variant="primary"
                onClick={() => {
                  setEditingActivity(null);
                  setFormData({ title: '', description: '', activityDate: '', activityTime: '', type: '', selectedTags: [] });
                }}
              >
                <Plus size={16} /> Nova Atividade
              </GlassButton>
            </DialogTrigger>

            <DialogContent style={{
              background: '#111827', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, maxWidth: 560, color: '#fff',
            }}>
              <DialogHeader>
                <DialogTitle style={{ fontFamily: "'Syne', sans-serif", color: '#fff' }}>
                  {editingActivity ? 'Editar Atividade' : 'Nova Atividade'}
                </DialogTitle>
                <DialogDescription style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Preencha os detalhes da atividade escolar
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Titulo *</label>
                  <input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Aula de Traveler"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Descricao</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva a atividade..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Data *</label>
                    <input type="date" value={formData.activityDate}
                      onChange={(e) => setFormData({ ...formData, activityDate: e.target.value })}
                      required style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Horario *</label>
                    <input type="time" value={formData.activityTime}
                      onChange={(e) => setFormData({ ...formData, activityTime: e.target.value })}
                      required style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Tipo de Atividade</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">Selecione um tipo</option>
                    {activityTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {tags && tags.length > 0 && (
                  <div>
                    <label style={labelStyle}>Tags</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {tags.map((tag: { id: number; name: string; color: string; description: string | null; createdAt: Date; updatedAt: Date }) => {
                        const isSelected = formData.selectedTags.includes(String(tag.id));
                        return (
                          <button key={tag.id} type="button"
                            onClick={() => {
                              const tagIdStr = String(tag.id);
                              setFormData({
                                ...formData,
                                selectedTags: isSelected
                                  ? formData.selectedTags.filter(id => id !== tagIdStr)
                                  : [...formData.selectedTags, tagIdStr]
                              });
                            }}
                            style={{
                              padding: '4px 12px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 500,
                              cursor: 'pointer', transition: 'all 0.2s',
                              background: isSelected ? 'rgba(77,168,255,0.15)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${isSelected ? 'rgba(77,168,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                              color: isSelected ? '#4da8ff' : 'rgba(255,255,255,0.5)',
                            }}
                          >
                            {tag.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
                  <GlassButton variant="primary" style={{ flex: 1, justifyContent: 'center' }}
                    disabled={createActivityMutation.isPending || updateActivityMutation.isPending}
                    onClick={() => { /* form submit handles it */ }}
                  >
                    {(createActivityMutation.isPending || updateActivityMutation.isPending) && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    {editingActivity ? 'Atualizar' : 'Criar'} Atividade
                  </GlassButton>
                  <GlassButton onClick={() => setIsDialogOpen(false)}>Cancelar</GlassButton>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Activities List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isLoading ? (
            // Skeleton loading
            [...Array(3)].map((_, i) => (
              <div key={i} style={{
                borderRadius: 16, padding: 20,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ height: 20, width: '60%', borderRadius: 8, background: 'rgba(255,255,255,0.05)', marginBottom: 10 }} className="animate-pulse" />
                <div style={{ height: 14, width: '80%', borderRadius: 6, background: 'rgba(255,255,255,0.03)', marginBottom: 14 }} className="animate-pulse" />
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ height: 12, width: 100, borderRadius: 6, background: 'rgba(255,255,255,0.03)' }} className="animate-pulse" />
                  <div style={{ height: 12, width: 60, borderRadius: 6, background: 'rgba(255,255,255,0.03)' }} className="animate-pulse" />
                </div>
              </div>
            ))
          ) : filteredActivities.length === 0 ? (
            <div style={{
              borderRadius: 16, padding: 48, textAlign: 'center',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <Calendar size={32} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px' }} />
              <p style={{ color: 'rgba(255,255,255,0.3)', margin: 0 }}>Nenhuma atividade encontrada</p>
            </div>
          ) : (
            filteredActivities.map(activity => (
              <div key={activity.id} style={{
                borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(20px)', transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
              >
                {/* Top shine */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 600,
                    fontSize: '1.05rem', color: '#fff', margin: 0,
                  }}>
                    {activity.title}
                  </h3>
                  <span style={{
                    padding: '3px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 500,
                    background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.15)',
                    color: '#a78bfa', flexShrink: 0,
                  }}>
                    {activity.type}
                  </span>
                </div>

                {activity.description && (
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', margin: '0 0 12px', lineHeight: 1.5 }}>
                    {activity.description}
                  </p>
                )}

                <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                    <Calendar size={13} /> {format(new Date(activity.activityDate), 'dd MMM yyyy', { locale: ptBR })}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                    <Clock size={13} /> {activity.activityTime}
                  </span>
                  {activity.tags && activity.tags.length > 0 && activity.tags.map((tag: any) => (
                    <span key={tag.id} style={{
                      display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem',
                      padding: '2px 8px', borderRadius: 999,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.4)',
                    }}>
                      <Tag size={10} /> {tag.name}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <GlassButton size="sm" onClick={() => {
                    navigator.clipboard.writeText(activity.inscriptionLink);
                  }}>
                    <LinkIcon size={13} /> Copiar Link
                  </GlassButton>
                  <GlassButton size="sm" onClick={() => handleEdit(activity)}>
                    <Edit2 size={13} /> Editar
                  </GlassButton>
                  <GlassButton size="sm" variant="danger"
                    onClick={() => handleDelete(activity.id)}
                    disabled={deleteActivityMutation.isPending}
                  >
                    {deleteActivityMutation.isPending ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                    Deletar
                  </GlassButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
