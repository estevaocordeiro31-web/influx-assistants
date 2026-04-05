// Template: Componente React para botão de gerar IDs
// Adicionar ao dashboard administrativo

import { Button } from "@/components/ui/button";
import { Hash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface GenerateIdsButtonProps {
  onSuccess?: () => void;
}

export function GenerateIdsButton({ onSuccess }: GenerateIdsButtonProps) {
  const assignAllIdsMutation = trpc.uniqueId.assignAllIds.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Erro ao gerar IDs: ${error.message}`);
    },
  });

  return (
    <Button
      variant="outline"
      onClick={() => assignAllIdsMutation.mutate()}
      disabled={assignAllIdsMutation.isPending}
    >
      {assignAllIdsMutation.isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Hash className="w-4 h-4 mr-2" />
      )}
      Gerar IDs
    </Button>
  );
}
