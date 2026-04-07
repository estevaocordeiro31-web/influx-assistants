import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface TipFeedbackButtonsProps {
  tipId: string;
  tipTitle: string;
  onFeedbackSubmitted?: () => void;
}

export default function TipFeedbackButtons({
  tipId,
  tipTitle,
  onFeedbackSubmitted,
}: TipFeedbackButtonsProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<"useful" | "not_useful" | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  // Mutation para salvar feedback
  const feedbackMutation = trpc.blogEngagement.saveFeedback.useMutation({
    onSuccess: () => {
      console.log("Feedback enviado com sucesso");
      setSelectedFeedback(null);
      setShowNotes(false);
      setNotes("");
      onFeedbackSubmitted?.();
    },
    onError: (error) => {
      console.error("Erro ao enviar feedback:", error);
    },
  });

  const handleSubmitFeedback = () => {
    if (!selectedFeedback) return;

    feedbackMutation.mutate({
      tipId,
      tipTitle,
      feedback: selectedFeedback,
      notes: notes || undefined,
    });
  };

  return (
    <div className="space-y-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
      <p className="text-sm text-slate-300 font-medium">Esta dica foi útil?</p>

      <div className="flex gap-2">
        <Button
          variant={selectedFeedback === "useful" ? "default" : "outline"}
          size="sm"
          className={
            selectedFeedback === "useful"
              ? "bg-green-500 text-slate-900 hover:bg-green-600"
              : "border-slate-500 text-slate-300 hover:bg-slate-600"
          }
          onClick={() => setSelectedFeedback("useful")}
          disabled={feedbackMutation.isPending}
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          Útil
        </Button>

        <Button
          variant={selectedFeedback === "not_useful" ? "default" : "outline"}
          size="sm"
          className={
            selectedFeedback === "not_useful"
              ? "bg-red-500 text-white hover:bg-red-600"
              : "border-slate-500 text-slate-300 hover:bg-slate-600"
          }
          onClick={() => setSelectedFeedback("not_useful")}
          disabled={feedbackMutation.isPending}
        >
          <ThumbsDown className="w-4 h-4 mr-1" />
          Não Útil
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-slate-200"
          onClick={() => setShowNotes(!showNotes)}
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          Comentário
        </Button>
      </div>

      {showNotes && (
        <div className="space-y-2">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Deixe um comentário (opcional)..."
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-green-500"
            rows={2}
            disabled={feedbackMutation.isPending}
          />
        </div>
      )}

      {selectedFeedback && (
        <>
          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-slate-900 font-bold"
            onClick={handleSubmitFeedback}
            disabled={feedbackMutation.isPending}
          >
            {feedbackMutation.isPending ? "Enviando..." : "Enviar Feedback"}
          </Button>

          {feedbackMutation.isSuccess && (
            <p className="text-sm text-green-400 text-center">✓ Feedback registrado com sucesso!</p>
          )}
          {feedbackMutation.isError && (
            <p className="text-sm text-red-400 text-center">✗ Erro ao registrar feedback</p>
          )}
        </>
      )}
    </div>
  );
}
