/**
 * Tiago Personalized Tabs Component
 * 
 * Componente com abas personalizadas para Tiago:
 * - Profissional: Conteúdo médico em inglês
 * - Traveller: Materiais para viagens (Cancun, Nova York)
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Stethoscope, Plane, MapPin, Users, BookOpen, Volume2 } from 'lucide-react';

interface MedicalTopic {
  id: string;
  title: string;
  description: string;
  vocabulary: string[];
  phrases: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface TravelDestination {
  id: string;
  city: string;
  country: string;
  when: string;
  materials: TravelMaterial[];
  character: 'lucas' | 'emily' | 'aiko';
}

interface TravelMaterial {
  id: string;
  title: string;
  category: 'phrases' | 'vocabulary' | 'dialogue' | 'cultural';
  content: string;
  audioUrl?: string;
}

const MEDICAL_TOPICS: MedicalTopic[] = [
  {
    id: 'med-1',
    title: 'Patient Consultation Basics',
    description: 'Essential phrases for greeting and assessing patients',
    vocabulary: [
      'symptom - sinal/sintoma',
      'diagnosis - diagnóstico',
      'prescription - prescrição/receita',
      'vital signs - sinais vitais',
      'blood pressure - pressão arterial',
      'heart rate - frequência cardíaca',
      'temperature - temperatura',
      'patient history - histórico do paciente',
    ],
    phrases: [
      '"Can you describe your symptoms?" - Você pode descrever seus sintomas?',
      '"How long have you had this pain?" - Há quanto tempo você tem essa dor?',
      '"Are you taking any medications?" - Você está tomando algum medicamento?',
      '"I\'m going to examine you now." - Vou examiná-lo agora.',
      '"Please take a deep breath." - Por favor, respire fundo.',
      '"This might feel a little uncomfortable." - Isso pode parecer um pouco desconfortável.',
    ],
    difficulty: 'beginner',
  },
  {
    id: 'med-2',
    title: 'Medical Terminology - Common Conditions',
    description: 'Vocabulary for common diseases and conditions',
    vocabulary: [
      'diabetes - diabetes',
      'hypertension - hipertensão',
      'asthma - asma',
      'pneumonia - pneumonia',
      'infection - infecção',
      'inflammation - inflamação',
      'allergy - alergia',
      'fracture - fratura',
    ],
    phrases: [
      '"You have high blood pressure." - Você tem pressão alta.',
      '"This is a common condition." - Esta é uma condição comum.',
      '"We need to run some tests." - Precisamos fazer alguns testes.',
      '"The treatment is straightforward." - O tratamento é direto.',
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'med-3',
    title: 'Prescriptions & Treatment Plans',
    description: 'How to explain medications and treatment options',
    vocabulary: [
      'dosage - dosagem',
      'tablet - comprimido',
      'capsule - cápsula',
      'injection - injeção',
      'side effects - efeitos colaterais',
      'contraindication - contraindicação',
      'follow-up - acompanhamento',
      'referral - encaminhamento',
    ],
    phrases: [
      '"Take one tablet twice a day." - Tome um comprimido duas vezes ao dia.',
      '"Take it with food." - Tome com comida.',
      '"Avoid alcohol while taking this medication." - Evite álcool ao tomar este medicamento.',
      '"Come back in two weeks for a follow-up." - Volte em duas semanas para um acompanhamento.',
    ],
    difficulty: 'intermediate',
  },
];

const TRAVEL_DESTINATIONS: TravelDestination[] = [
  {
    id: 'cancun',
    city: 'Cancun',
    country: 'Mexico',
    when: 'Next Month',
    character: 'lucas',
    materials: [
      {
        id: 'cancun-1',
        title: 'Hotel Check-in Dialogue',
        category: 'dialogue',
        content: `Lucas: "Good afternoon! Welcome to our hotel. How can I help you?"
Tiago: "Hi! I have a reservation under Tiago Marques."
Lucas: "Perfect! Let me check that for you. How many nights will you be staying?"
Tiago: "Three nights, from tomorrow to the 15th."
Lucas: "Great! Here's your room key. You're in room 305 on the third floor."`,
      },
      {
        id: 'cancun-2',
        title: 'Beach & Resort Vocabulary',
        category: 'vocabulary',
        content: `
• Beach - praia
• Ocean - oceano
• Wave - onda
• Sunscreen - protetor solar
• Swimsuit - roupa de banho
• Towel - toalha
• Lifeguard - salva-vidas
• Snorkel - snorkel
• Coral reef - recife de coral
• Tropical fish - peixe tropical
        `,
      },
      {
        id: 'cancun-3',
        title: 'Restaurant Ordering',
        category: 'phrases',
        content: `
"I\'d like to order..." - Eu gostaria de pedir...
"What do you recommend?" - O que você recomenda?
"Is this spicy?" - Isso é picante?
"Can I have the check, please?" - Posso ter a conta, por favor?
"This is delicious!" - Isto é delicioso!
"No ice, please." - Sem gelo, por favor.
        `,
      },
    ],
  },
  {
    id: 'newyork',
    city: 'New York',
    country: 'USA',
    when: 'Soon',
    character: 'lucas',
    materials: [
      {
        id: 'ny-1',
        title: 'NYC Taxi & Transportation',
        category: 'dialogue',
        content: `
Lucas: "Where are you headed?"
Tiago: "I need to go to the Empire State Building, please."
Lucas: "Sure thing! That's about 20 minutes from here depending on traffic."
Tiago: "How much will it cost?"
Lucas: "Should be around $15 to $20."
Tiago: "Okay, that works for me."
        `,
      },
      {
        id: 'ny-2',
        title: 'NYC Attractions & Sightseeing',
        category: 'vocabulary',
        content: `
• Times Square - Praça Times
• Central Park - Parque Central
• Statue of Liberty - Estátua da Liberdade
• Brooklyn Bridge - Ponte do Brooklyn
• Empire State Building - Edifício Empire State
• Metropolitan Museum - Museu Metropolitano
• Broadway - Broadway (teatro)
• Subway - metrô
• Skyscraper - arranha-céu
• Tourist - turista
        `,
      },
      {
        id: 'ny-3',
        title: 'American Accent & Connected Speech',
        category: 'cultural',
        content: `
Key differences in American English:
• Pronunciation of 'r' - always pronounced
• 'T' sounds - often sounds like 'd' (water = wader)
• Stress patterns - different from British English
• Casual expressions: "What's up?" "How's it going?" "You good?"
• Connected speech: "Wanna" (want to), "Gonna" (going to), "Gotta" (got to)

Practice phrases:
"I wanna visit the Statue of Liberty." 
"We're gonna take the subway to Times Square."
"You gotta see Central Park at sunset."
        `,
      },
    ],
  },
];

export function TiagoPersonalizedTabs() {
  const [selectedMedicalTopic, setSelectedMedicalTopic] = useState<string>(MEDICAL_TOPICS[0].id);
  const [selectedDestination, setSelectedDestination] = useState<string>(TRAVEL_DESTINATIONS[0].id);

  const currentMedicalTopic = MEDICAL_TOPICS.find((t) => t.id === selectedMedicalTopic);
  const currentDestination = TRAVEL_DESTINATIONS.find((d) => d.id === selectedDestination);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header com Avatar */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663292442852/ehhzZKDyjAyBAjSZ.png"
            alt="Tiago"
            className="w-32 h-32 rounded-full shadow-lg border-4 border-blue-500"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, Tiago! 👋</h1>
        <p className="text-gray-600 mt-2">Seu aprendizado personalizado de inglês</p>
        <Badge className="mt-3 bg-blue-100 text-blue-800">Book 2 - Elementary</Badge>
      </div>

      {/* Tabs Principais */}
      <Tabs defaultValue="professional" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            Profissional
          </TabsTrigger>
          <TabsTrigger value="traveller" className="flex items-center gap-2">
            <Plane className="w-4 h-4" />
            Traveller
          </TabsTrigger>
        </TabsList>

        {/* ABA 1: PROFISSIONAL */}
        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-red-500" />
                Medical English for Doctors
              </CardTitle>
              <CardDescription>
                Aprenda inglês médico para comunicação com pacientes e colegas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seletor de Tópicos */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700">Selecione um tópico:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {MEDICAL_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedMedicalTopic(topic.id)}
                      className={`p-3 text-left rounded-lg border-2 transition-all ${
                        selectedMedicalTopic === topic.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{topic.title}</div>
                      <div className="text-xs text-gray-600">{topic.description}</div>
                      <Badge className="mt-2 bg-gray-100 text-gray-700">
                        {topic.difficulty}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conteúdo do Tópico Selecionado */}
              {currentMedicalTopic && (
                <div className="space-y-4 mt-6 pt-6 border-t">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Vocabulário Essencial
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentMedicalTopic.vocabulary.map((vocab, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="text-sm font-mono text-blue-900">{vocab}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Frases Úteis
                    </h4>
                    <div className="space-y-2">
                      {currentMedicalTopic.phrases.map((phrase, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-green-50 rounded-lg border border-green-200 flex items-start gap-3"
                        >
                          <Volume2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <div className="text-sm text-green-900">{phrase}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                    Praticar com Fluxie
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 2: TRAVELLER */}
        <TabsContent value="traveller" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-500" />
                Travel English - Suas Viagens
              </CardTitle>
              <CardDescription>
                Materiais personalizados para suas próximas viagens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seletor de Destinos */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700">Seus Destinos:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {TRAVEL_DESTINATIONS.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => setSelectedDestination(dest.id)}
                      className={`p-3 text-left rounded-lg border-2 transition-all ${
                        selectedDestination === dest.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-sm flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {dest.city}, {dest.country}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{dest.when}</div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">{dest.character}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conteúdo do Destino Selecionado */}
              {currentDestination && (
                <div className="space-y-4 mt-6 pt-6 border-t">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-gray-900">
                      {currentDestination.city} Travel Guide
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Com Lucas (sotaque americano) - Prepare-se para sua viagem!
                    </p>
                  </div>

                  {/* Materiais de Viagem */}
                  <div className="space-y-3">
                    {currentDestination.materials.map((material) => (
                      <Card key={material.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{material.title}</CardTitle>
                              <Badge className="mt-2 bg-blue-100 text-blue-800">
                                {material.category}
                              </Badge>
                            </div>
                            {material.audioUrl && (
                              <Button size="sm" variant="outline">
                                <Volume2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg font-mono">
                            {material.content}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    Praticar Diálogos com Lucas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-600">
        <p>📱 Dica: Pratique diariamente com Fluxie para melhorar sua pronúncia e fluência!</p>
      </div>
    </div>
  );
}
