import { describe, it, expect } from 'vitest';
import { 
  getFirstName, 
  capitalizeFirstLetter, 
  parseInfluxName, 
  formatGreeting,
  prepareNameForMessage 
} from './name-utils';

describe('name-utils', () => {
  describe('getFirstName', () => {
    it('deve extrair primeiro nome de formato inFlux', () => {
      expect(getFirstName('Samantha int Carlos 6789')).toBe('Samantha');
    });

    it('deve extrair primeiro nome de nome completo', () => {
      expect(getFirstName('João Silva Santos')).toBe('João');
    });

    it('deve retornar nome único corretamente', () => {
      expect(getFirstName('Maria')).toBe('Maria');
    });

    it('deve capitalizar corretamente nomes em maiúsculo', () => {
      expect(getFirstName('CARLOS EDUARDO')).toBe('Carlos');
    });

    it('deve capitalizar corretamente nomes em minúsculo', () => {
      expect(getFirstName('ana paula')).toBe('Ana');
    });

    it('deve lidar com espaços extras', () => {
      expect(getFirstName('  Pedro   Silva  ')).toBe('Pedro');
    });

    it('deve retornar string vazia para null', () => {
      expect(getFirstName(null)).toBe('');
    });

    it('deve retornar string vazia para undefined', () => {
      expect(getFirstName(undefined)).toBe('');
    });

    it('deve retornar string vazia para string vazia', () => {
      expect(getFirstName('')).toBe('');
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('deve capitalizar primeira letra', () => {
      expect(capitalizeFirstLetter('maria')).toBe('Maria');
    });

    it('deve converter resto para minúsculo', () => {
      expect(capitalizeFirstLetter('MARIA')).toBe('Maria');
    });

    it('deve lidar com string vazia', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });
  });

  describe('parseInfluxName', () => {
    it('deve parsear formato completo inFlux', () => {
      const result = parseInfluxName('Samantha int Carlos 6789');
      expect(result.firstName).toBe('Samantha');
      expect(result.tag).toBe('int');
      expect(result.attendantName).toBe('Carlos');
      expect(result.phoneEnd).toBe('6789');
    });

    it('deve parsear nome simples', () => {
      const result = parseInfluxName('Maria');
      expect(result.firstName).toBe('Maria');
      expect(result.tag).toBeNull();
      expect(result.attendantName).toBeNull();
      expect(result.phoneEnd).toBeNull();
    });

    it('deve reconhecer diferentes tags', () => {
      expect(parseInfluxName('João aluno Pedro 1234').tag).toBe('aluno');
      expect(parseInfluxName('Ana ex Maria 5678').tag).toBe('ex');
      expect(parseInfluxName('Carlos ind Lucas 9012').tag).toBe('ind');
    });

    it('deve lidar com null', () => {
      const result = parseInfluxName(null);
      expect(result.firstName).toBe('');
      expect(result.original).toBe('');
    });
  });

  describe('formatGreeting', () => {
    it('deve formatar saudação com primeiro nome', () => {
      expect(formatGreeting('Samantha int Carlos 6789', 'Boa tarde')).toBe('Boa tarde, Samantha');
    });

    it('deve usar saudação padrão', () => {
      expect(formatGreeting('Maria Silva')).toBe('Olá, Maria');
    });

    it('deve retornar apenas saudação se nome vazio', () => {
      expect(formatGreeting('', 'Boa noite')).toBe('Boa noite');
    });
  });

  describe('prepareNameForMessage', () => {
    it('deve preparar nome para mensagem de campanha', () => {
      expect(prepareNameForMessage('Samantha int Carlos 6789')).toBe('Samantha');
      expect(prepareNameForMessage('João Silva')).toBe('João');
      expect(prepareNameForMessage('MARIA')).toBe('Maria');
    });
  });
});
