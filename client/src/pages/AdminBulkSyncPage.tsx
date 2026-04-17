import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Loader2, CheckCircle2, AlertCircle, Users, ChevronLeft, RefreshCw } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AdminBulkSyncPage() {
  const [, setLocation] = useLocation();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [syncedCount, setSyncedCount] = useState(0);

  const syncMutation = trpc.bulkStudentSync.syncAllStudents.useMutation({
    onSuccess: (data) => {
      setSyncStatus('success');
      setSyncedCount(data.created + data.updated);
      setSyncMessage(`${data.created + data.updated} alunos sincronizados com sucesso!`);
    },
    onError: (error) => {
      setSyncStatus('error');
      setSyncMessage(`Erro na sincronizacao: ${error.message}`);
    },
  });

  const statusQuery = trpc.bulkStudentSync.getSyncStatus.useQuery(undefined, { refetchInterval: 5000 });

  const handleSync = () => {
    setSyncStatus('syncing');
    setSyncMessage('Sincronizando alunos do Dashboard...');
    syncMutation.mutate({ dryRun: false });
  };

  const syncInfo = [
    'Nome completo do aluno',
    'Email e telefone',
    'Nivel (Book 1-5)',
    'Livros ja cursados',
    'Cursos extras inscritos',
    'Objetivo de aprendizado',
    'Senhas temporarias',
  ];

  const steps = [
    { num: '1', text: 'Sincronizar alunos: Clique no botao acima para importar os 182 alunos do Dashboard' },
    { num: '2', text: 'Gerar mensagens: Crie 182 mensagens personalizadas com nome, nivel e data de desbloqueio' },
    { num: '3', text: 'Enviar credenciais: O webhook enviara status de criacao de acesso ao Dashboard para envio via WhatsApp' },
    { num: '4', text: 'Testar com 5 alunos: Valide o fluxo completo antes de expandir para todos os 182' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #06090f 0%, #0c1222 40%, #111827 100%)',
      fontFamily: "'DM Sans', sans-serif",
      padding: '24px 16px',
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
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

        {/* Header card */}
        <div style={{
          borderRadius: 20,
          padding: '28px 24px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          {/* Top shine */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(77,168,255,0.15), transparent)',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(77,168,255,0.1)', border: '1px solid rgba(77,168,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Users size={22} style={{ color: '#4da8ff' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                Sincronizacao em Massa
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', margin: 0 }}>
                Sincronize ate 182 alunos ativos do Dashboard central
              </p>
            </div>
          </div>

          {/* Stats */}
          {statusQuery.data && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{
                padding: '16px 14px', borderRadius: 14,
                background: 'rgba(77,168,255,0.06)', border: '1px solid rgba(77,168,255,0.1)',
              }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', margin: '0 0 4px' }}>Alunos Sincronizados</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#4da8ff', fontFamily: "'Syne', sans-serif", margin: 0 }}>
                  {statusQuery.data.totalStudents}
                </p>
              </div>
              <div style={{
                padding: '16px 14px', borderRadius: 14,
                background: 'rgba(106,191,75,0.06)', border: '1px solid rgba(106,191,75,0.1)',
              }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', margin: '0 0 4px' }}>Ultima Sincronizacao</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6abf4b', margin: 0 }}>
                  {statusQuery.data.lastSync
                    ? new Date(statusQuery.data.lastSync).toLocaleString('pt-BR')
                    : 'Nunca'}
                </p>
              </div>
            </div>
          )}

          {/* Status message */}
          {syncMessage && (
            <div style={{
              padding: '12px 14px', borderRadius: 12, marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 10,
              background: syncStatus === 'success'
                ? 'rgba(106,191,75,0.08)' : syncStatus === 'error'
                ? 'rgba(239,68,68,0.08)' : 'rgba(77,168,255,0.08)',
              border: `1px solid ${syncStatus === 'success'
                ? 'rgba(106,191,75,0.15)' : syncStatus === 'error'
                ? 'rgba(239,68,68,0.15)' : 'rgba(77,168,255,0.15)'}`,
            }}>
              {syncStatus === 'success' && <CheckCircle2 size={18} style={{ color: '#6abf4b', flexShrink: 0 }} />}
              {syncStatus === 'error' && <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />}
              {syncStatus === 'syncing' && <Loader2 size={18} style={{ color: '#4da8ff', flexShrink: 0 }} className="animate-spin" />}
              <p style={{
                fontSize: '0.85rem', margin: 0,
                color: syncStatus === 'success' ? '#6abf4b' : syncStatus === 'error' ? '#ef4444' : '#4da8ff',
              }}>
                {syncMessage}
              </p>
            </div>
          )}

          {/* Sync button */}
          <button
            onClick={handleSync}
            disabled={syncStatus === 'syncing'}
            style={{
              width: '100%', padding: '14px 20px', borderRadius: 14,
              background: syncStatus === 'syncing'
                ? 'rgba(77,168,255,0.08)'
                : 'linear-gradient(135deg, rgba(77,168,255,0.15), rgba(106,191,75,0.1))',
              border: '1px solid rgba(77,168,255,0.2)',
              color: '#4da8ff', fontSize: '1rem', fontWeight: 600,
              cursor: syncStatus === 'syncing' ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {syncStatus === 'syncing' ? (
              <><Loader2 size={18} className="animate-spin" /> Sincronizando...</>
            ) : (
              <><RefreshCw size={18} /> Sincronizar 182 Alunos</>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', marginTop: 10 }}>
            Esta acao importara todos os alunos ativos do Dashboard central
          </p>
        </div>

        {/* Sync info */}
        <div style={{
          borderRadius: 20, padding: '22px 20px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)', marginBottom: 16,
        }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.95rem', color: '#fff', margin: '0 0 14px' }}>
            O que sera sincronizado
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {syncInfo.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} style={{ color: '#6abf4b', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div style={{
          borderRadius: 20, padding: '22px 20px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
        }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.95rem', color: '#fff', margin: '0 0 14px' }}>
            Proximos Passos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {steps.map((step) => (
              <div key={step.num} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(77,168,255,0.08)', border: '1px solid rgba(77,168,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700, color: '#4da8ff',
                }}>
                  {step.num}
                </span>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
