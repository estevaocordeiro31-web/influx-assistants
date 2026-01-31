import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Film, User } from 'lucide-react';
import { AnimationScriptCard } from './AnimationScriptCard';
import { ALL_ANIMATION_SCRIPTS, getScriptsByCharacter } from '@/data/animation-scripts';

export function AnimationScriptsTab() {
  const [selectedCharacter, setSelectedCharacter] = useState<'all' | 'lucas' | 'emily' | 'aiko'>('all');

  const filteredScripts = selectedCharacter === 'all' 
    ? ALL_ANIMATION_SCRIPTS 
    : getScriptsByCharacter(selectedCharacter);

  const characterTabs = [
    { id: 'all', label: 'Todos', emoji: '🎬', count: ALL_ANIMATION_SCRIPTS.length },
    { id: 'lucas', label: 'Lucas', emoji: '🇺🇸', count: getScriptsByCharacter('lucas').length },
    { id: 'emily', label: 'Emily', emoji: '🇬🇧', count: getScriptsByCharacter('emily').length },
    { id: 'aiko', label: 'Aiko', emoji: '🇦🇺', count: getScriptsByCharacter('aiko').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Film className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-800">Animation Stories</h2>
        </div>
        <p className="text-gray-600">
          Histórias curtas e divertidas dos personagens para aprender chunks e expressões
        </p>
      </div>

      {/* Filtro por personagem */}
      <div className="flex flex-wrap justify-center gap-2">
        {characterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCharacter(tab.id as typeof selectedCharacter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              selectedCharacter === tab.id
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{tab.emoji}</span>
            <span className="font-medium">{tab.label}</span>
            <Badge 
              variant={selectedCharacter === tab.id ? "secondary" : "outline"}
              className={selectedCharacter === tab.id ? "bg-white/20 text-white" : ""}
            >
              {tab.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Grid de roteiros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredScripts.map((script) => (
          <AnimationScriptCard key={script.id} script={script} />
        ))}
      </div>

      {/* Dica */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-semibold text-purple-700">Dica de Aprendizado</h4>
            <p className="text-sm text-gray-600">
              Ouça cada cena várias vezes e repita em voz alta! Preste atenção no <strong>connected speech</strong> - 
              é assim que nativos realmente falam no dia a dia. Tente imitar a entonação e o ritmo!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
