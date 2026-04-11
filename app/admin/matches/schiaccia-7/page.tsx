import { prisma } from "@/lib/prisma";
import { AddSchiaccia7Form } from "@/components/forms/AddSchiaccia7Form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";

async function getData() {
  const [players, matches] = await Promise.all([
    prisma.player.findMany({ orderBy: { name: "asc" } }),
    prisma.schiacciaSette.findMany({
      include: {
        participants: { include: { player: true } },
      },
      orderBy: { playedAt: "desc" },
      take: 20,
    }),
  ]);
  return { players, matches };
}

export default async function Schiaccia7Page() {
  const { players, matches } = await getData();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <span>🃏</span> Schiaccia 7
          </h1>
          <p className="text-sm text-muted-foreground">Registra i risultati delle partite</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">➕ Nuova Partita</CardTitle>
          </CardHeader>
          <CardContent>
            <AddSchiaccia7Form players={players} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>📋 Ultime Partite</span>
              <span className="text-sm font-normal text-muted-foreground">{matches.length} recenti</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {matches.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Nessuna partita ancora registrata.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {matches.map((match) => (
                  <li key={match.id} className="px-6 py-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-secondary">🏆</span>
                        {match.participants
                          .filter((p) => p.isWinner)
                          .map((p) => (
                            <span key={p.id} className="text-sm font-bold text-secondary">
                              {p.player.emoji} {p.player.name}
                            </span>
                          ))
                          .reduce<React.ReactNode[]>((acc, el, i) => (i === 0 ? [el] : [...acc, <span key={`sep-${i}`} className="text-muted-foreground text-xs">&amp;</span>, el]), [])}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {format(new Date(match.playedAt), "dd MMM", { locale: it })}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Giocatori: {match.participants.map((p) => p.player.name).join(", ")}
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
