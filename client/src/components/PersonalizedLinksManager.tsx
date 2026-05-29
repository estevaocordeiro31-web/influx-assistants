import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Copy, Trash2, ExternalLink } from 'lucide-react';

interface PersonalizedLink {
  id: string;
  studentName: string;
  studentEmail: string;
  link: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
}

export default function PersonalizedLinksManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [links, setLinks] = useState<PersonalizedLink[]>([
    {
      id: '1',
      studentName: 'João Silva',
      studentEmail: 'joao@example.com',
      link: 'https://influx.com/access/abc123xyz',
      createdAt: '2026-05-28',
      expiresAt: '2026-12-28',
      used: true,
    },
    {
      id: '2',
      studentName: 'Maria Santos',
      studentEmail: 'maria@example.com',
      link: 'https://influx.com/access/def456uvw',
      createdAt: '2026-05-27',
      expiresAt: '2026-12-27',
      used: false,
    },
  ]);

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Link copiado!');
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const filteredLinks = links.filter(link =>
    link.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gerenciador de Links Personalizados
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Crie e gerencie links de acesso personalizados para alunos
        </p>
      </div>

      {/* Criar Novo Link */}
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Link</CardTitle>
          <CardDescription>
            Gere um link personalizado válido por 7 meses para um aluno
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Busca de Aluno */}
            <div className="space-y-2">
              <Label>Buscar Aluno</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nome, email ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Gerar Link Personalizado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Links */}
      <Card>
        <CardHeader>
          <CardTitle>Links Gerados</CardTitle>
          <CardDescription>
            {filteredLinks.length} link(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLinks.map(link => (
              <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{link.studentName}</p>
                  <p className="text-sm text-gray-500">{link.studentEmail}</p>
                  <p className="text-xs text-gray-400 mt-1">Expira em: {link.expiresAt}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyLink(link.link)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(link.link, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteLink(link.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
