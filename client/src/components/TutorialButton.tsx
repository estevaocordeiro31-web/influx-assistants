import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TutorialButtonProps {
  onClick: () => void;
}

export function TutorialButton({ onClick }: TutorialButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className="text-slate-400 hover:text-green-400 hover:bg-slate-800/50 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Ver tutorial novamente</p>
      </TooltipContent>
    </Tooltip>
  );
}
