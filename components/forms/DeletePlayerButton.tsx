"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeletePlayerButton({ playerId }: { playerId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Eliminare questo giocatore? Tutte le sue partite verranno rimosse.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/players/${playerId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Errore durante l'eliminazione");
      toast.success("Giocatore rimosso");
      router.refresh();
    } catch {
      toast.error("Impossibile eliminare il giocatore");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 rounded-lg text-muted-foreground hover:text-tertiary hover:bg-tertiary/10 transition-colors disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
