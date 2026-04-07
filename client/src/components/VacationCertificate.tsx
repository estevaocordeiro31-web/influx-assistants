import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Share2, Sparkles, Star, Trophy, CheckCircle2 } from "lucide-react";

interface VacationCertificateProps {
  studentName: string;
  completionDate: Date;
  lessonsCompleted: number;
  totalLessons: number;
  averageScore: number;
  onClose: () => void;
}

export function VacationCertificate({
  studentName,
  completionDate,
  lessonsCompleted,
  totalLessons,
  averageScore,
  onClose
}: VacationCertificateProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getGrade = () => {
    if (averageScore >= 90) return { grade: "A+", color: "text-yellow-400", description: "Excelente!" };
    if (averageScore >= 80) return { grade: "A", color: "text-green-400", description: "Muito Bom!" };
    if (averageScore >= 70) return { grade: "B", color: "text-blue-400", description: "Bom!" };
    if (averageScore >= 60) return { grade: "C", color: "text-cyan-400", description: "Aprovado!" };
    return { grade: "D", color: "text-orange-400", description: "Continue Praticando!" };
  };

  const gradeInfo = getGrade();

  const handleDownload = async () => {
    setIsDownloading(true);
    // Simular download - em produção, geraria um PDF real
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Criar um canvas para gerar a imagem do certificado
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f3460');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 800);
      
      // Border
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 1160, 760);
      
      // Inner border
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, 1120, 720);
      
      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CERTIFICATE OF COMPLETION', 600, 120);
      
      // Subtitle
      ctx.fillStyle = '#00d4ff';
      ctx.font = '24px Arial';
      ctx.fillText('Vacation Plus 2 - International English', 600, 160);
      
      // This certifies
      ctx.fillStyle = '#cccccc';
      ctx.font = '20px Arial';
      ctx.fillText('This is to certify that', 600, 240);
      
      // Student name
      ctx.fillStyle = '#00ff88';
      ctx.font = 'bold 42px Arial';
      ctx.fillText(studentName, 600, 300);
      
      // Description
      ctx.fillStyle = '#cccccc';
      ctx.font = '18px Arial';
      ctx.fillText('has successfully completed the Vacation Plus 2 course', 600, 360);
      ctx.fillText('demonstrating proficiency in American, British, and Australian English', 600, 390);
      
      // Stats
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.fillText(`Lessons Completed: ${lessonsCompleted}/${totalLessons}`, 400, 480);
      ctx.fillText(`Average Score: ${averageScore}%`, 800, 480);
      
      // Grade
      ctx.fillStyle = gradeInfo.color === 'text-yellow-400' ? '#fbbf24' : 
                      gradeInfo.color === 'text-green-400' ? '#4ade80' :
                      gradeInfo.color === 'text-blue-400' ? '#60a5fa' : '#22d3ee';
      ctx.font = 'bold 64px Arial';
      ctx.fillText(gradeInfo.grade, 600, 570);
      
      // Date
      ctx.fillStyle = '#888888';
      ctx.font = '16px Arial';
      ctx.fillText(`Issued on ${formatDate(completionDate)}`, 600, 650);
      
      // Logo text
      ctx.fillStyle = '#00d4ff';
      ctx.font = 'bold 28px Arial';
      ctx.fillText('inFlux English School', 600, 720);
      
      // Characters flags
      ctx.font = '32px Arial';
      ctx.fillText('🇺🇸 🇬🇧 🇦🇺', 600, 760);
    }
    
    // Download
    const link = document.createElement('a');
    link.download = `vacation-plus-2-certificate-${studentName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    setIsDownloading(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vacation Plus 2 Certificate',
          text: `I completed the Vacation Plus 2 course at inFlux with a ${gradeInfo.grade} grade! 🎉`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gradient-to-br from-gray-900 via-blue-900/50 to-purple-900/50 border-2 border-cyan-500/50 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-green-500 to-purple-500" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
        
        <CardContent className="p-8 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Award className="w-20 h-20 text-yellow-400" />
                <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              CERTIFICATE OF COMPLETION
            </h1>
            <p className="text-cyan-400 text-lg">
              Vacation Plus 2 - International English
            </p>
          </div>

          {/* Main content */}
          <div className="text-center space-y-6 mb-8">
            <p className="text-gray-400">This is to certify that</p>
            
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-green-400 to-purple-400 bg-clip-text text-transparent">
              {studentName}
            </h2>
            
            <p className="text-gray-300 max-w-2xl mx-auto">
              has successfully completed the <strong className="text-white">Vacation Plus 2</strong> course,
              demonstrating proficiency in American, British, and Australian English
              through cultural understanding and practical communication skills.
            </p>

            {/* Characters */}
            <div className="flex justify-center gap-8 py-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl mb-2">
                  🇺🇸
                </div>
                <p className="text-xs text-gray-400">Lucas</p>
                <p className="text-xs text-blue-400">New York</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-3xl mb-2">
                  🇬🇧
                </div>
                <p className="text-xs text-gray-400">Emily</p>
                <p className="text-xs text-pink-400">London</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-3xl mb-2">
                  🇦🇺
                </div>
                <p className="text-xs text-gray-400">Aiko</p>
                <p className="text-xs text-purple-400">Sydney</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{lessonsCompleted}/{totalLessons}</p>
                <p className="text-xs text-gray-400">Lessons</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{averageScore}%</p>
                <p className="text-xs text-gray-400">Average</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <Trophy className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className={`text-2xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</p>
                <p className="text-xs text-gray-400">Grade</p>
              </div>
            </div>

            {/* Grade badge */}
            <div className="flex justify-center">
              <Badge className={`text-lg px-6 py-2 ${
                gradeInfo.grade === 'A+' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500' :
                gradeInfo.grade === 'A' ? 'bg-green-500/20 text-green-400 border-green-500' :
                gradeInfo.grade === 'B' ? 'bg-blue-500/20 text-blue-400 border-blue-500' :
                'bg-cyan-500/20 text-cyan-400 border-cyan-500'
              }`}>
                {gradeInfo.description}
              </Badge>
            </div>

            {/* Date */}
            <p className="text-gray-500 text-sm">
              Issued on {formatDate(completionDate)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="outline"
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? "Generating..." : "Download Certificate"}
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-700 text-center">
            <p className="text-cyan-400 font-semibold">inFlux English School</p>
            <p className="text-gray-500 text-xs">Jundiaí - SP, Brazil</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
