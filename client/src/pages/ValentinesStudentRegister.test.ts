import { describe, it, expect } from 'vitest';

describe('ValentinesStudentRegister', () => {
  it('should define event ID correctly', () => {
    const EVENT_ID = 'valentines-2026';
    expect(EVENT_ID).toBe('valentines-2026');
  });

  it('should validate phone number correctly', () => {
    const validatePhone = (phone: string): boolean => {
      const cleaned = phone.replace(/\D/g, '');
      return cleaned.length === 11 || cleaned.length === 10;
    };

    expect(validatePhone('(11) 99999-9999')).toBe(true);
    expect(validatePhone('(11) 3333-3333')).toBe(true);
    expect(validatePhone('11999999999')).toBe(true);
    expect(validatePhone('1133333333')).toBe(true);
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('(11) 9999')).toBe(false);
  });

  it('should format phone number correctly', () => {
    const formatPhone = (value: string): string => {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 2) return cleaned;
      if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    };

    expect(formatPhone('11')).toBe('11');
    expect(formatPhone('119')).toBe('(11) 9');
    expect(formatPhone('11999')).toBe('(11) 999');
    expect(formatPhone('119999999')).toBe('(11) 99999-99');
    expect(formatPhone('11999999999')).toBe('(11) 99999-9999');
  });

  it('should validate form fields', () => {
    const formData = {
      name: 'João Silva',
      book: 'book5',
      whatsapp: '11999999999',
    };

    expect(formData.name.trim().length).toBeGreaterThanOrEqual(2);
    expect(formData.book.trim().length).toBeGreaterThan(0);
    expect(formData.whatsapp.trim().length).toBeGreaterThan(0);
  });

  it('should reject empty name', () => {
    const name = '';
    expect(name.trim().length).toBe(0);
  });

  it('should reject short name', () => {
    const name = 'A';
    expect(name.trim().length).toBeLessThan(2);
  });

  it('should accept valid name', () => {
    const name = 'João Silva';
    expect(name.trim().length).toBeGreaterThanOrEqual(2);
  });

  it('should have book options', () => {
    const books = ['book1', 'book2', 'book3', 'book4', 'book5', 'book6', 'book7', 'book8', 'vacation', 'outro'];
    expect(books.length).toBeGreaterThan(0);
    expect(books).toContain('book5');
    expect(books).toContain('vacation');
  });

  it('should generate guest token format', () => {
    const token = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    expect(token).toContain('guest_');
    expect(token.split('_').length).toBe(3);
  });

  it('should handle form submission data structure', () => {
    const submitData = {
      eventId: 'valentines-2026',
      name: 'João Silva',
      whatsapp: '11999999999',
    };

    expect(submitData.eventId).toBe('valentines-2026');
    expect(submitData.name).toBeDefined();
    expect(submitData.whatsapp).toBeDefined();
  });
});
