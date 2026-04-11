import { prisma } from "@/lib/prisma";
import { AddDoublesForm } from "@/components/forms/AddDoublesForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";

async function getData() {
  const [players, matches] = await Promise.all([
    prisma.player.findMany({ orderBy: { name: "asc" } }),
    prisma.pingPongDoubles.findMany({
      include: { team1PlayerA: true, team1PlayerB: true, team2PlayerA: true, team2PlayerB: true },
      orderBy: { playedAt: "desc" },
      take: 20,
    }),
  ]);
  return { players, matches };
}

export default async function DoublesPage() {
  const { players, matches } = await getData();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <span>🤝</span> Ping Pong Doppio
          </h1>
          <p className="text-sm text-muted-foreground">Sfide 2 vs 2</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">➕ Nuova Sfida</CardTitle>
          </CardHeader>
          <CardContent>
            <AddDoublesForm players={players} />
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
                {matches.map((match) => (
                  <li key={match.id} className="px-6 py-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs space-y-0.5 min-w-0">
                        <div className={`font-semibold ${match.winnerTeam === 1 ? "text-secondary" : "text-muted-foreground"}`}>
                          {match.team1PlayerA.emoji}{match.team1PlayerB.emoji} {match.team1PlayerA.name} & {match.team1PlayerB.name}
                          {" "}
                          <span className="font-black text-foreground">{match.score1}</span>
                        </div>
                        <div className={`font-semibold ${match.winnerTeam === 2 ? "text-secondary" : "text-muted-foreground"}`}>
                          {match.team2PlayerA.emoji}{match.team2PlayerB.emoji} {match.team2PlayerA.name} & {match.team2PlayerB.name}
                          {" "}
                          <span className="font-black text-foreground">{match.score2}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {format(new Date(match.playedAt), "dd MMM", { locale: it })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
