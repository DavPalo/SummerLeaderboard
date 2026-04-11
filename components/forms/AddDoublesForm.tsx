"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Player { id: string; name: string; emoji: string }

export function AddDoublesForm({ players }: { players: Player[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [team1A, setTeam1A] = useState("");
  const [team1B, setTeam1B] = useState("");
  const [team2A, setTeam2A] = useState("");
  const [team2B, setTeam2B] = useState("");
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");

  const usedIds = [team1A, team1B, team2A, team2B].filter(Boolean);

  function availableFor(excludeIds: string[]) {
    return players.filter((p) => !excludeIds.includes(p.id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allSelected = [team1A, team1B, team2A, team2B].every(Boolean);
    if (!allSelected) return toast.error("Seleziona tutti e 4 i giocatori");

    const unique = new Set([team1A, team1B, team2A, team2B]);
    if (unique.size < 4) return toast.error("I giocatori devono essere tutti diversi");

    const s1 = parseInt(score1), s2 = parseInt(score2);
    if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) return toast.error("Inserisci punteggi validi");
    if (s1 === s2) return toast.error("Non ci possono essere pareggi");

    setLoading(true);
    try {
      const winnerTeam = s1 > s2 ? 1 : 2;
      const res = await fetch("/api/ping-pong/doubles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team1PlayerAId: team1A, team1PlayerBId: team1B,
          team2PlayerAId: team2A, team2PlayerBId: team2B,
          score1: s1, score2: s2, winnerTeam,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Errore");
      toast.success("Sfida registrata! 🤝");
      setTeam1A(""); setTeam1B(""); setTeam2A(""); setTeam2B("");
      setScore1(""); setScore2("");
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Team 1 */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
        <Label className="text-primary font-bold text-xs uppercase tracking-wider">🟠 Team 1</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select value={team1A} onValueChange={setTeam1A}>
            <SelectTrigger><SelectValue placeholder="Giocatore A" /></SelectTrigger>
            <SelectContent>
              {availableFor([team1B, team2A, team2B]).map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.emoji} {p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={team1B} onValueChange={setTeam1B}>
            <SelectTrigger><SelectValue placeholder="Giocatore B" /></SelectTrigger>
            <SelectContent>
              {availableFor([team1A, team2A, team2B]).map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.emoji} {p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Punteggio Team 1</Label>
          <Input type="number" min={0} placeholder="0" value={score1} onChange={(e) => setScore1(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm font-black text-muted-foreground">VS</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Team 2 */}
      <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4 space-y-3">
        <Label className="text-secondary font-bold text-xs uppercase tracking-wider">🟡 Team 2</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select value={team2A} onValueChange={setTeam2A}>
            <SelectTrigger><SelectValue placeholder="Giocatore A" /></SelectTrigger>
            <SelectContent>
              {availableFor([team1A, team1B, team2B]).map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.emoji} {p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={team2B} onValueChange={setTeam2B}>
            <SelectTrigger><SelectValue placeholder="Giocatore B" /></SelectTrigger>
            <SelectContent>
              {availableFor([team1A, team1B, team2A]).map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.emoji} {p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Punteggio Team 2</Label>
          <Input type="number" min={0} placeholder="0" value={score2} onChange={(e) => setScore2(e.target.value)} />
        </div>
      </div>

      {score1 && score2 && parseInt(score1) !== parseInt(score2) && (
        <div className="rounded-lg border border-secondary/30 bg-secondary/10 p-3 text-sm">
          <span className="text-secondary font-medium">Vincitore: </span>
          {parseInt(score1) > parseInt(score2) ? "🟠 Team 1" : "🟡 Team 2"}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          "Registra Sfida 🤝"
        )}
      </Button>
    </form>
  );
}
