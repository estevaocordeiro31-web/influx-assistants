import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, MapPin } from "lucide-react";
import type { CulturalFact } from "@/data/vacation-plus-2-expanded";

interface CulturalFactCardProps {
  fact: CulturalFact;
}

const cityConfig = {
  nyc: {
    name: "Nova York",
    flag: "🇺🇸",
    color: "from-blue-600 to-purple-600",
    borderColor: "border-blue-500/50",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
  },
  london: {
    name: "Londres",
    flag: "🇬🇧",
    color: "from-red-600 to-rose-600",
    borderColor: "border-red-500/50",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
  },
  sydney: {
    name: "Sydney",
    flag: "🇦🇺",
    color: "from-yellow-500 to-amber-500",
    borderColor: "border-yellow-500/50",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-400",
  },
};

const characterConfig = {
  lucas: {
    name: "Lucas",
    avatar: "/images/characters/lucas-adult.png",
  },
  emily: {
    name: "Emily",
    avatar: "/images/characters/emily-london.jpg",
  },
  aiko: {
    name: "Aiko",
    avatar: "/images/characters/aiko-adult.png",
  },
};

export function CulturalFactCard({ fact }: CulturalFactCardProps) {
  const city = cityConfig[fact.city];
  const character = characterConfig[fact.character];

  return (
    <Card className={`bg-gradient-to-br from-slate-800 to-slate-900 ${city.borderColor} border hover:scale-[1.02] transition-all duration-300`}>
      <CardContent className="p-4">
        {/* Header com cidade e personagem */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className={`h-4 w-4 ${city.textColor}`} />
            <span className={`text-sm font-medium ${city.textColor}`}>
              {city.flag} {city.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <img 
              src={character.avatar} 
              alt={character.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-600"
            />
            <span className="text-xs text-slate-400">{character.name}</span>
          </div>
        </div>

        {/* Título */}
        <h3 className="text-lg font-bold text-white mb-2">
          {fact.title}
        </h3>

        {/* Fato principal */}
        <p className="text-sm text-slate-300 mb-3">
          {fact.fact}
        </p>

        {/* Fun Fact */}
        <div className={`p-3 rounded-lg ${city.bgColor} border ${city.borderColor}`}>
          <div className="flex items-start gap-2">
            <Lightbulb className={`h-4 w-4 ${city.textColor} mt-0.5 flex-shrink-0`} />
            <div>
              <Badge variant="outline" className={`${city.textColor} ${city.borderColor} text-xs mb-1`}>
                Dica de Inglês
              </Badge>
              <p className="text-xs text-slate-300">
                {fact.funFact}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
