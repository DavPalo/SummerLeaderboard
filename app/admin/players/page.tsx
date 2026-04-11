import { prisma } from "@/lib/prisma";
import { AddPlayerForm } from "@/components/forms/AddPlayerForm";
import { DeletePlayerButton } from "@/components/forms/DeletePlayerButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getPlayers() {
  return prisma.player.findMany({ orderBy: { createdAt: "asc" } });
}

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black">Giocatori</h1>
          <p className="text-sm text-muted-foreground">Aggiungi e gestisci i partecipanti</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Add Player Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span>➕</span>
              Aggiungi Giocatore
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AddPlayerForm />
          </CardContent>
        </Card>

        {/* Players List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary" />
              Lista Giocatori
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {players.length} totali
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {players.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm px-6">
                Nessun giocatore ancora. Aggiungine uno!
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {players.map((player) => (
                  <li key={player.id} className="flex items-center gap-3 px-6 py-3">
                    <span className="text-xl">{player.emoji}</span>
                    <span className="flex-1 font-medium text-sm">{player.name}</span>
                    <DeletePlayerButton playerId={player.id} />
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
