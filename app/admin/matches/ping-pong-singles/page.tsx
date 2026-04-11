import { prisma } from "@/lib/prisma";
import { AddSinglesForm } from "@/components/forms/AddSinglesForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";

async function getData() {
  const [players, matches] = await Promise.all([
    prisma.player.findMany({ orderBy: { name: "asc" } }),
    prisma.pingPongSingles.findMany({
      include: { player1: true, player2: true, winner: true },
      orderBy: { playedAt: "desc" },
      take: 20,
    }),
  ]);
  return { players, matches };
}

export default async function SinglesPage() {
  const { players, matches } = await getData();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <span>🏓</span> Ping Pong Singoli
          </h1>
          <p className="text-sm text-muted-foreground">Sfide 1 vs 1</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">➕ Nuova Sfida</CardTitle>
          </CardHeader>
          <CardContent>
            <AddSinglesForm players={players} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>📋 Ultime Sfide</span>
              <span className="text-sm font-normal text-muted-foreground">{matches.length} recenti</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {matches.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Nessuna sfida ancora registrata.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {matches.map((match) => {
                  const isP1Winner = match.winnerId === match.player1Id;
                  return (
                    <li key={match.id} className="px-6 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className={`text-sm font-semibold truncate ${isP1Winner ? "text-secondary" : "text-muted-foreground"}`}>
                            {match.player1.emoji} {match.player1.name}
                          </span>
                          <span className="text-xs font-black text-foreground px-1">
                            {match.score1} - {match.score2}
                          </span>
                          <span className={`text-sm font-semibold truncate ${!isP1Winner ? "text-secondary" : "text-muted-foreground"}`}>
                            {match.player2.emoji} {match.player2.name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {format(new Date(match.playedAt), "dd MMM", { locale: it })}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
