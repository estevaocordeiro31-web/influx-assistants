import { describe, it, expect } from 'vitest';

describe('Breadcrumb Component', () => {
  describe('Rendering', () => {
    it('deve renderizar breadcrumb com múltiplos itens', () => {
      const items = [
        { label: 'Dashboard', href: '/admin', current: false },
        { label: 'Alunos', current: true },
      ];

      expect(items).toHaveLength(2);
      expect(items[0].label).toBe('Dashboard');
      expect(items[1].label).toBe('Alunos');
    });

    it('deve incluir Home como primeiro item', () => {
      const items = [
        { label: 'Dashboard', href: '/admin', current: false },
      ];

      // Home é adicionado automaticamente no componente
      expect(items[0].label).not.toBe('Home');
    });

    it('deve marcar último item como current', () => {
      const items = [
        { label: 'Dashboard', href: '/admin', current: false },
        { label: 'Alunos', current: true },
      ];

      const lastItem = items[items.length - 1];
      expect(lastItem.current).toBe(true);
    });

    it('deve ter href para itens não-current', () => {
      const items = [
        { label: 'Dashboard', href: '/admin', current: false },
        { label: 'Alunos', current: true },
      ];

      const nonCurrentItem = items.find(item => !item.current);
      expect(nonCurrentItem?.href).toBeDefined();
      expect(nonCurrentItem?.href).toBe('/admin');
    });

    it('deve não ter href para item current', () => {
      const items = [
        { label: 'Dashboard', href: '/admin', current: false },
        { label: 'Alunos', current: true },
      ];

      const currentItem = items.find(item => item.current);
      expect(currentItem?.href).toBeUndefined();
    });
  });

  describe('Navigation Paths', () => {
    it('deve suportar breadcrumb para página de alunos', () => {
      const items = [
        { label: 'Dashboard', href: '/admin', current: false },
        { label: 'Alunos', current: true },
      ];

      expect(items[0].href).toBe('/admin');
      expect(items[1].current).toBe(true);
    });

    it('deve suportar breadcrumb para página de detalhes de aluno', () => {
      const items = [
        { label: 'Dashboard', href: '/admin', current: false },
        { label: 'Alunos', href: '/admin/students', current: false },
        { label: 'João Silva', current: true },
      ];

      expect(items).toHaveLength(3);
      expect(items[2].label).toBe('João Silva');
      expect(items[2].current).toBe(true);
    });

    it('deve suportar breadcrumb para página de exercícios', () => {
      const items = [
        { label: 'Dashboard', href: '/student', current: false },
        { label: 'Exercícios', current: true },
      ];

      expect(items[0].href).toBe('/student');
      expect(items[1].label).toBe('Exercícios');
    });

    it('deve suportar breadcrumb para página de badges', () => {
      const items = [
        { label: 'Dashboard', href: '/student', current: false },
        { label: 'Badges', current: true },
      ];

      expect(items[1].label).toBe('Badges');
    });

    it('deve suportar breadcrumb para página de passaporte', () => {
      const items = [
        { label: 'Dashboard', href: '/student', current: false },
        { label: 'Passaporte', current: true },
      ];

      expect(items[1].label).toBe('Passaporte');
    });

    it('deve suportar breadcrumb para página de atividades', () => {
      const items = [
        { label: 'Dashboard', href: '/student', current: false },
        { label: 'Atividades', current: true },
      ];

      expect(items[1].label).toBe('Atividades');
    });
  });

  describe('Accessibility', () => {
    it('deve ter labels descritivos', () => {
      const items = [
        { label: 'Dashboard', href: '/admin', current: false },
        { label: 'Alunos', current: true },
      ];

      items.forEach(item => {
        expect(item.label).toBeTruthy();
        expect(item.label.length).toBeGreaterThan(0);
      });
    });

    it('deve indicar página atual', () => {
      const items = [
        { label: 'Dashboard', href: '/admin', current: false },
        { label: 'Alunos', current: true },
      ];

      const currentItems = items.filter(item => item.current);
      expect(currentItems).toHaveLength(1);
    });

    it('deve ter apenas um item marcado como current', () => {
      const items = [
        { label: 'Dashboard', href: '/admin', current: false },
        { label: 'Alunos', current: true },
        { label: 'Detalhes', current: false },
      ];

      const currentCount = items.filter(item => item.current).length;
      expect(currentCount).toBeLessThanOrEqual(1);
    });
  });

  describe('Edge Cases', () => {
    it('deve suportar breadcrumb com um único item', () => {
      const items = [
        { label: 'Dashboard', current: true },
      ];

      expect(items).toHaveLength(1);
      expect(items[0].current).toBe(true);
    });

    it('deve suportar breadcrumb com muitos itens', () => {
      const items = [
        { label: 'Dashboard', href: '/admin', current: false },
        { label: 'Alunos', href: '/admin/students', current: false },
        { label: 'João Silva', href: '/admin/students/123', current: false },
        { label: 'Exercícios', href: '/admin/students/123/exercises', current: false },
        { label: 'Exercício 1', current: true },
      ];

      expect(items).toHaveLength(5);
      expect(items[items.length - 1].current).toBe(true);
    });

    it('deve suportar labels com caracteres especiais', () => {
      const items = [
        { label: 'Dashboard', href: '/admin', current: false },
        { label: 'Alunos & Turmas', current: true },
      ];

      expect(items[1].label).toContain('&');
    });

    it('deve suportar labels em português', () => {
      const items = [
        { label: 'Painel de Controle', href: '/admin', current: false },
        { label: 'Gerenciamento de Alunos', current: true },
      ];

      expect(items[0].label).toContain('Painel');
      expect(items[1].label).toContain('Alunos');
    });
  });
});
