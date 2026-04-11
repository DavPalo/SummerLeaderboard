import Link from "next/link";
import { Users, Trophy, Swords, Dumbbell } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function getStats() {
  const [players, schiaccia, singles, doubles] = await Promise.all([
    prisma.player.count(),
    prisma.schiacciaSette.count(),
    prisma.pingPongSingles.count(),
    prisma.pingPongDoubles.count(),
  ]);
  return { players, schiaccia, singles, doubles };
}

const adminCards = [
  {
    title: "Giocatori",
    description: "Aggiungi e gestisci i partecipanti",
    href: "/admin/players",
    icon: Users,
    color: "text-secondary",
    bg: "bg-secondary/10",
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    title: "Schiaccia 7",
    description: "Registra i risultati delle partite",
    href: "/admin/matches/schiaccia-7",
    icon: Trophy,
    color: "text-primary",
    bg: "bg-primary/10",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Ping Pong Singoli",
    description: "Registra sfide 1 vs 1",
    href: "/admin/matches/ping-pong-singles",
    icon: Swords,
    color: "text-secondary",
    bg: "bg-secondary/10",
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    title: "Ping Pong Doppio",
    description: "Registra sfide 2 vs 2",
    href: "/admin/matches/ping-pong-doubles",
    icon: Dumbbell,
    color: "text-tertiary",
    bg: "bg-tertiary/10",
    gradient: "from-tertiary/20 to-tertiary/5",
  },
];

export default async function AdminPage() {
  const stats = await getStats();

  const statItems = [
    { label: "Giocatori", value: stats.players, emoji: "👥" },
    { label: "Partite Schiaccia 7", value: stats.schiaccia, emoji: "🃏" },
    { label: "Singoli Ping Pong", value: stats.singles, emoji: "🏓" },
    { label: "Doppi Ping Pong", value: stats.doubles, emoji: "🤝" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gradient mb-1">Dashboard Admin</h1>
        <p className="text-muted-foreground">Gestisci giocatori e registra i risultati</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4 text-center"
          >
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <div className="text-2xl font-black text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {adminCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.href}
              className={`relative overflow-hidden hover:border-border/80 transition-all hover:shadow-lg group`}
            >
              <div className={`absolute inset-0 pointer-events-none bg-gradient-to-br ${card.gradient} opacity-50`} />
              <CardHeader className="relative">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} mb-2`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </CardHeader>
              <CardContent className="relative">
                <Button asChild variant="outline" size="sm" className="group-hover:border-primary/50 transition-colors">
                  <Link href={card.href}>Gestisci →</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Link to Leaderboard */}
      <div className="mt-8 text-center">
        <Button asChild variant="ghost" size="sm">
          <Link href="/leaderboard">← Vedi classifiche pubbliche</Link>
        </Button>
      </div>
    </main>
  );
}
