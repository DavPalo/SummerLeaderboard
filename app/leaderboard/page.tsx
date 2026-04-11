import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LeaderboardSection } from "@/components/leaderboard/LeaderboardSection";
import { PairsTable } from "@/components/leaderboard/PairsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  getSchiaccia7Leaderboard,
  getSinglesLeaderboard,
  getDoublesPairsLeaderboard,
  getDoublesIndividualLeaderboard,
} from "@/lib/leaderboard";

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 justify-center">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-36 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [schiaccia7, singles, doublesPairs, doublesIndividual] = await Promise.all([
    getSchiaccia7Leaderboard(),
    getSinglesLeaderboard(),
    getDoublesPairsLeaderboard(),
    getDoublesIndividualLeaderboard(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gradient">Classifiche</h1>
        </div>

        <Tabs defaultValue="schiaccia7">
          <TabsList className="w-full grid grid-cols-3 bg-card border border-border p-1 rounded-xl mb-4">
            <TabsTrigger value="schiaccia7" className="text-xs sm:text-sm gap-1.5">
              <span>🃏</span>
              <span className="hidden sm:inline">Schiaccia 7</span>
              <span className="sm:hidden">S7</span>
            </TabsTrigger>
            <TabsTrigger value="singles" className="text-xs sm:text-sm gap-1.5">
              <span>🏓</span>
              <span className="hidden sm:inline">Ping Pong Singoli</span>
              <span className="sm:hidden">Singoli</span>
            </TabsTrigger>
            <TabsTrigger value="doubles" className="text-xs sm:text-sm gap-1.5">
              <span>🤝</span>
              <span className="hidden sm:inline">Ping Pong Doppio</span>
              <span className="sm:hidden">Doppio</span>
            </TabsTrigger>
          </TabsList>

          {/* ── Schiaccia 7 ── */}
          <TabsContent value="schiaccia7">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl">🃏</div>
                <div>
                  <h2 className="text-lg font-bold">Schiaccia 7</h2>
                  <p className="text-xs text-muted-foreground">Classifica generale</p>
                </div>
              </div>
              <Suspense fallback={<LoadingSkeleton />}>
                <LeaderboardSection qualified={schiaccia7.qualified} participants={schiaccia7.participants} />
              </Suspense>
            </div>
          </TabsContent>

          {/* ── Ping Pong Singoli ── */}
          <TabsContent value="singles">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-xl">🏓</div>
                <div>
                  <h2 className="text-lg font-bold">Ping Pong Singoli</h2>
                  <p className="text-xs text-muted-foreground">1 vs 1</p>
                </div>
              </div>
              <Suspense fallback={<LoadingSkeleton />}>
                <LeaderboardSection qualified={singles.qualified} participants={singles.participants} />
              </Suspense>
            </div>
          </TabsContent>

          {/* ── Ping Pong Doppio ── */}
          <TabsContent value="doubles">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-8 overflow-hidden">

              {/* Sezione 1: Classifica individuale nel doppio */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary/10 text-xl">🏓</div>
                  <div>
                    <h2 className="text-lg font-bold">Classifica Individuale</h2>
                    <p className="text-xs text-muted-foreground">Vittorie personali nelle partite di doppio</p>
                  </div>
                </div>
                <Suspense fallback={<LoadingSkeleton />}>
                  <LeaderboardSection qualified={doublesIndividual.qualified} participants={doublesIndividual.participants} />
                </Suspense>
              </div>

              <Separator />

              {/* Sezione 2: Coppie vincenti */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-xl">🤝</div>
                  <div>
                    <h2 className="text-lg font-bold">Coppie Vincenti</h2>
                    <p className="text-xs text-muted-foreground">Quali coppie vincono di più insieme</p>
                  </div>
                </div>
                <Suspense fallback={<Skeleton className="h-32 w-full rounded-xl" />}>
                  <PairsTable qualified={doublesPairs.qualified} participants={doublesPairs.participants} />
                </Suspense>
              </div>

            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
