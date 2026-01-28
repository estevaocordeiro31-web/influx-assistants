import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

import { Upload, Save, User, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function EditProfile() {

  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: profile, isLoading, refetch } = trpc.studentProfile.getProfile.useQuery();
  const updateProfile = trpc.studentProfile.updateProfile.useMutation();
  
  const [photoUrl, setPhotoUrl] = useState("");
  const [learningGoal, setLearningGoal] = useState("");
  const [notifyDaily, setNotifyDaily] = useState(true);
  const [notifyBadges, setNotifyBadges] = useState(true);
  const [notifyTips, setNotifyTips] = useState(true);

  useEffect(() => {
    if (profile) {
      setPhotoUrl(profile.photo_url || "");
      setLearningGoal(profile.learning_goal || "");
      setNotifyDaily(profile.notification_preferences.daily);
      setNotifyBadges(profile.notification_preferences.badges);
      setNotifyTips(profile.notification_preferences.tips);
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        photo_url: photoUrl,
        learning_goal: learningGoal,
        notification_preferences: {
          daily: notifyDaily,
          badges: notifyBadges,
          tips: notifyTips,
        },
      });
      
      alert("✅ Perfil atualizado com sucesso!");
      
      refetch();
    } catch (error) {
      alert("❌ Erro ao salvar perfil. Tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1f3a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39ff14]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f3a]">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/student/dashboard")}
            className="text-white hover:text-[#39ff14]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Editar Perfil</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl py-8">
        <div className="mb-6">
          <p className="text-gray-400">Personalize sua experiência no inFlux Personal Tutor</p>
        </div>

        <div className="grid gap-6">
          {/* Foto de Perfil */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Foto de Perfil
              </CardTitle>
              <CardDescription>Adicione uma foto para personalizar seu perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={photoUrl} alt="Foto de perfil" />
                  <AvatarFallback className="bg-[#39ff14] text-black text-2xl">
                    {user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <Label htmlFor="photo-url" className="text-white">URL da Foto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="photo-url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://exemplo.com/foto.jpg"
                      className="bg-gray-900 border-gray-600 text-white"
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Cole a URL de uma imagem ou faça upload
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Objetivo de Aprendizado */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Objetivo de Aprendizado</CardTitle>
              <CardDescription>
                Conte-nos o que você quer alcançar com o inglês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={learningGoal}
                onChange={(e) => setLearningGoal(e.target.value)}
                placeholder="Ex: Quero melhorar minha conversação para viagens internacionais..."
                className="bg-gray-900 border-gray-600 text-white min-h-[120px]"
              />
            </CardContent>
          </Card>

          {/* Preferências de Notificação */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Notificações</CardTitle>
              <CardDescription>
                Escolha como você quer ser notificado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Lembretes Diários</Label>
                  <p className="text-sm text-gray-400">
                    Receba lembretes para praticar todos os dias
                  </p>
                </div>
                <Switch
                  checked={notifyDaily}
                  onCheckedChange={setNotifyDaily}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Conquistas e Badges</Label>
                  <p className="text-sm text-gray-400">
                    Seja notificado quando desbloquear novos badges
                  </p>
                </div>
                <Switch
                  checked={notifyBadges}
                  onCheckedChange={setNotifyBadges}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Dicas do Blog</Label>
                  <p className="text-sm text-gray-400">
                    Receba dicas personalizadas do blog da inFlux
                  </p>
                </div>
                <Switch
                  checked={notifyTips}
                  onCheckedChange={setNotifyTips}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botão Salvar */}
          <Button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="w-full bg-[#39ff14] hover:bg-[#2ecc11] text-black font-bold"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateProfile.isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </main>
    </div>
  );
}
