# Padrões de Formato de ID Único

## Formatos Recomendados

### Formato Padrão: PREFIX-YYYY-NNNN
- **PREFIX**: 2-4 letras identificando a organização (ex: INF, STU, USR)
- **YYYY**: Ano de criação (permite reset anual)
- **NNNN**: Número sequencial com 4 dígitos (0001-9999)

Exemplo: `INF-2026-0001`, `STU-2026-0042`

### Formato Compacto: PREFIXNNNNNN
- **PREFIX**: 2-3 letras
- **NNNNNN**: Número sequencial com 6 dígitos

Exemplo: `INF000001`, `STU000042`

### Formato UUID Curto: PREFIX-XXXXXX
- **PREFIX**: 2-4 letras
- **XXXXXX**: 6 caracteres alfanuméricos aleatórios

Exemplo: `INF-A3B2C1`, `STU-X9Y8Z7`

## Considerações

| Aspecto | Recomendação |
|---------|--------------|
| Unicidade | Usar índice UNIQUE no banco |
| Legibilidade | Preferir formato com hífens |
| Escalabilidade | 4 dígitos = 9999 IDs/ano |
| Privacidade | Evitar dados pessoais no ID |

## Funções Auxiliares

### generateUniqueId(prefix, year, sequence)
```typescript
function generateUniqueId(prefix: string, year: number, sequence: number): string {
  return `${prefix}-${year}-${String(sequence).padStart(4, '0')}`;
}
```

### getNextSequence(db, prefix, year)
```typescript
async function getNextSequence(db: Database, prefix: string, year: number): Promise<number> {
  const pattern = `${prefix}-${year}-%`;
  const result = await db.execute(
    sql`SELECT MAX(CAST(SUBSTRING(student_id, -4) AS UNSIGNED)) as max_seq 
        FROM users WHERE student_id LIKE ${pattern}`
  );
  return (result[0]?.max_seq || 0) + 1;
}
```
