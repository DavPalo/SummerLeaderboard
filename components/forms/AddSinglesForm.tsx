"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Player { id: string; name: string; emoji: string }

export function AddSinglesForm({ players }: { players: Player[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [player1Id, setPlayer1Id] = useState("");
  const [player2Id, setPlayer2Id] = useState("");
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!player1Id || !player2Id) return toast.error("Seleziona entrambi i giocatori");
    if (player1Id === player2Id) return toast.error("I giocatori devono essere diversi");
    const s1 = parseInt(score1), s2 = parseInt(score2);
    if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) return toast.error("Inserisci punteggi validi");
    if (s1 === s2) return toast.error("Non ci possono essere pareggi");

    setLoading(true);
    try {
      const winnerId = s1 > s2 ? player1Id : player2Id;
      const res = await fetch("/api/ping-pong/singles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player1Id, player2Id, score1: s1, score2: s2, winnerId }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Errore");
      toast.success("Sfida registrata! 🏓");
      setPlayer1Id(""); setPlayer2Id(""); setScore1(""); setScore2("");
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const available1 = players.filter((p) => p.id !== player2Id);
  const available2 = players.filter((p) => p.id !== player1Id);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Giocatore 1</Label>
          <Select value={player1Id} onValueChange={setPlayer1Id}>
            <SelectTrigger><SelectValue placeholder="Scegli..." /></SelectTrigger>
            <SelectContent>
              {available1.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.emoji} {p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Giocatore 2</Label>
          <Select value={player2Id} onValueChange={setPlayer2Id}>
            <SelectTrigger><SelectValue placeholder="Scegli..." /></SelectTrigger>
            <SelectContent>
              {available2.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.emoji} {p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Punteggio G1</Label>
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={score1}
            onChange={(e) => setScore1(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Punteggio G2</Label>
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={score2}
            onChange={(e) => setScore2(e.target.value)}
          />
        </div>
      </div>

      {score1 && score2 && parseInt(score1) !== parseInt(score2) && player1Id && player2Id && (
        <div className="rounded-lg border border-secondary/30 bg-secondary/10 p-3 text-sm">
          <span className="text-secondary font-medium">Vincitore: </span>
          {(() => {
            const winner = parseInt(score1) > parseInt(score2)
              ? players.find((p) => p.id === player1Id)
              : players.find((p) => p.id === player2Id);
            return winner ? `${winner.emoji} ${winner.name}` : "—";
          })()}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          "Registra Sfida 🏓"
        )}
      </Button>
    </form>
  );
}
