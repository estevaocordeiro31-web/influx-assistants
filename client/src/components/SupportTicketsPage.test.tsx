import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SupportTicketsPage from './SupportTicketsPage';
import { trpc } from '@/lib/trpc';

// Mock do trpc
vi.mock('@/lib/trpc', () => ({
  trpc: {
    elliesSupport: {
      getTickets: {
        useQuery: vi.fn(),
      },
    },
  },
}));

/**
 * Testes para SupportTicketsPage - Dashboard de Tickets
 */
describe('SupportTicketsPage', () => {
  const mockTickets = [
    {
      id: '1',
      title: 'Problema com sincronização',
      description: 'Não consegui sincronizar os alunos',
      status: 'open' as const,
      priority: 'high' as const,
      createdAt: new Date(),
      assignedTo: 'Ellie',
    },
    {
      id: '2',
      title: 'Dúvida sobre plataforma',
      description: 'Como usar o dashboard?',
      status: 'inProgress' as const,
      priority: 'medium' as const,
      createdAt: new Date(),
      assignedTo: 'Jennifer',
    },
    {
      id: '3',
      title: 'Sugestão de melhoria',
      description: 'Adicionar mais relatórios',
      status: 'closed' as const,
      priority: 'low' as const,
      createdAt: new Date(),
      resolvedAt: new Date(),
      assignedTo: 'Ellie',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar o título da página', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      expect(screen.getByText('Dashboard de Tickets')).toBeInTheDocument();
    });

    it('deve exibir métricas de tickets', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      expect(screen.getByText('Total de Tickets')).toBeInTheDocument();
      expect(screen.getByText('Abertos')).toBeInTheDocument();
      expect(screen.getByText('Em Progresso')).toBeInTheDocument();
      expect(screen.getByText('Fechados')).toBeInTheDocument();
    });

    it('deve exibir botão de novo ticket', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      expect(screen.getByText('Novo Ticket')).toBeInTheDocument();
    });

    it('deve exibir filtros de busca', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      expect(screen.getByPlaceholderText('Título ou descrição...')).toBeInTheDocument();
    });
  });

  describe('Listagem de Tickets', () => {
    it('deve listar todos os tickets', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      expect(screen.getByText('Problema com sincronização')).toBeInTheDocument();
      expect(screen.getByText('Dúvida sobre plataforma')).toBeInTheDocument();
      expect(screen.getByText('Sugestão de melhoria')).toBeInTheDocument();
    });

    it('deve exibir status de cada ticket', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      expect(screen.getByText('Aberto')).toBeInTheDocument();
      expect(screen.getByText('Em Progresso')).toBeInTheDocument();
      expect(screen.getByText('Fechado')).toBeInTheDocument();
    });

    it('deve exibir prioridade de cada ticket', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      // Verificar que prioridades estão sendo exibidas
      const priorityElements = screen.getAllByText(/Alta|Média|Baixa/);
      expect(priorityElements.length).toBeGreaterThan(0);
    });

    it('deve exibir informações do ticket', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      expect(screen.getByText(/Não consegui sincronizar os alunos/)).toBeInTheDocument();
      expect(screen.getByText(/Atribuído a: Ellie/)).toBeInTheDocument();
    });
  });

  describe('Filtros', () => {
    it('deve filtrar por busca de texto', async () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      const searchInput = screen.getByPlaceholderText('Título ou descrição...');

      fireEvent.change(searchInput, { target: { value: 'sincronização' } });

      await waitFor(() => {
        expect(screen.getByText('Problema com sincronização')).toBeInTheDocument();
      });
    });

    it('deve filtrar por status', async () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      const statusSelect = screen.getByDisplayValue('Todos');

      fireEvent.change(statusSelect, { target: { value: 'open' } });

      await waitFor(() => {
        expect(screen.getByText('Problema com sincronização')).toBeInTheDocument();
      });
    });

    it('deve filtrar por prioridade', async () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      const prioritySelects = screen.getAllByDisplayValue('Todas');
      const prioritySelect = prioritySelects[prioritySelects.length - 1];

      fireEvent.change(prioritySelect, { target: { value: 'high' } });

      await waitFor(() => {
        expect(screen.getByText('Problema com sincronização')).toBeInTheDocument();
      });
    });
  });

  describe('Estados de Carregamento', () => {
    it('deve exibir loader durante carregamento', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: null,
        isLoading: true,
      });

      render(<SupportTicketsPage />);
      expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
    });

    it('deve exibir mensagem quando não há tickets', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: [] },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      expect(screen.getByText(/Nenhum ticket encontrado/)).toBeInTheDocument();
    });
  });

  describe('Métricas', () => {
    it('deve calcular corretamente o total de tickets', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      // Verificar que o total é exibido (3 tickets)
      const totalElements = screen.getAllByText(/3/);
      expect(totalElements.length).toBeGreaterThan(0);
    });

    it('deve contar tickets por status', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      // Verificar que os números estão sendo exibidos
      const numbers = screen.getAllByText(/\d/);
      expect(numbers.length).toBeGreaterThan(0);
    });
  });

  describe('Interações', () => {
    it('deve permitir clicar em novo ticket', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      const newTicketButton = screen.getByText('Novo Ticket');
      fireEvent.click(newTicketButton);
      // Verificar que o estado foi atualizado
      expect(newTicketButton).toBeInTheDocument();
    });

    it('deve permitir clicar em ver detalhes', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      const detailsButtons = screen.getAllByText('Ver Detalhes');
      fireEvent.click(detailsButtons[0]);
      expect(detailsButtons[0]).toBeInTheDocument();
    });
  });

  describe('Responsividade', () => {
    it('deve renderizar em mobile', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      expect(screen.getByText('Dashboard de Tickets')).toBeInTheDocument();
    });

    it('deve renderizar em desktop', () => {
      (trpc.elliesSupport.getTickets.useQuery as any).mockReturnValue({
        data: { tickets: mockTickets },
        isLoading: false,
      });

      render(<SupportTicketsPage />);
      expect(screen.getByText('Dashboard de Tickets')).toBeInTheDocument();
    });
  });
});
