"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Player { id: string; name: string; emoji: string }

export function AddSchiaccia7Form({ players }: { players: Player[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [winnerIds, setWinnerIds] = useState<string[]>([]);

  function toggleParticipant(id: string) {
    setParticipantIds((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      // Remove from winners if deselected as participant
      if (!next.includes(id)) setWinnerIds((w) => w.filter((w) => w !== id));
      return next;
    });
  }

  function toggleWinner(id: string) {
    setWinnerIds((prev) => {
      if (prev.includes(id)) return prev.filter((w) => w !== id);
      if (prev.length >= 2) {
        toast.error("Puoi selezionare solo 2 vincitori");
        return prev;
      }
      return [...prev, id];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (participantIds.length < 2) return toast.error("Seleziona almeno 2 partecipanti");
    if (winnerIds.length !== 2) return toast.error("Seleziona esattamente 2 vincitori");

    setLoading(true);
    try {
      const res = await fetch("/api/schiaccia-7", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winnerIds, participantIds }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Errore");
      toast.success("Partita registrata! 🃏");
      setParticipantIds([]);
      setWinnerIds([]);
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const eligibleWinners = players.filter((p) => participantIds.includes(p.id));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Partecipanti */}
      <div className="space-y-2">
        <Label>Partecipanti</Label>
        <p className="text-xs text-muted-foreground">Seleziona chi ha giocato</p>
        <div className="flex flex-wrap gap-2">
          {players.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggleParticipant(p.id)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                participantIds.includes(p.id)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-border/80 hover:bg-accent"
              }`}
            >
              <span>{p.emoji}</span>
              {p.name}
            </button>
          ))}
        </div>
        {players.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nessun giocatore.{" "}
            <a href="/admin/players" className="text-primary underline">Aggiungine uno.</a>
          </p>
        )}
      </div>

      {/* Vincitori (coppia) */}
      {eligibleWinners.length > 0 && (
        <div className="space-y-2">
          <Label>
            Vincitori{" "}
            <span className="text-xs font-normal text-muted-foreground">
              ({winnerIds.length}/2 selezionati)
            </span>
          </Label>
          <p className="text-xs text-muted-foreground">Seleziona la coppia che ha vinto</p>
          <div className="flex flex-wrap gap-2">
            {eligibleWinners.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleWinner(p.id)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                  winnerIds.includes(p.id)
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-border hover:border-border/80 hover:bg-accent"
                }`}
              >
                {winnerIds.includes(p.id) && <span>🏆</span>}
                <span>{p.emoji}</span>
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          "Registra Partita 🃏"
        )}
      </Button>
    </form>
  );
}
