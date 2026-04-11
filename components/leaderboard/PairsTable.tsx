"use client";

import { motion } from "framer-motion";
import type { PairEntry } from "@/lib/leaderboard";
import { cn } from "@/lib/utils";

const MIN_GAMES = 10;

interface PairsTableProps {
  qualified: PairEntry[];
  participants: PairEntry[];
}

function PairRank({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-xl">🥇</span>;
  if (rank === 2) return <span className="text-xl">🥈</span>;
  if (rank === 3) return <span className="text-xl">🥉</span>;
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
      {rank}
    </span>
  );
}

function PairBadges({ pair }: { pair: PairEntry }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold">
        <span>{pair.emojiA}</span>
        <span>{pair.nameA}</span>
      </span>
      <span className="text-xs text-muted-foreground font-bold">&amp;</span>
      <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold">
        <span>{pair.emojiB}</span>
        <span>{pair.nameB}</span>
      </span>
    </div>
  );
}

export function PairsTable({ qualified, participants }: PairsTableProps) {
  if (qualified.length === 0 && participants.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-3xl mb-2">🤝</p>
        <p className="text-sm">Nessuna partita di doppio ancora registrata.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {qualified.length > 0 ? (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-10">#</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Coppia</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">
                  <span className="text-primary">V</span>/<span className="text-tertiary">S</span>
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-20 hidden sm:table-cell">Win %</th>
              </tr>
            </thead>
            <tbody>
              {qualified.map((pair, idx) => (
                <motion.tr
                  key={pair.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={cn(
                    "border-b border-border/50 transition-colors hover:bg-accent/50",
                    idx === qualified.length - 1 && "border-b-0"
                  )}
                >
                  <td className="px-3 py-3.5">
                    <PairRank rank={idx + 1} />
                  </td>
                  <td className="px-3 py-3.5 min-w-0">
                    <PairBadges pair={pair} />
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <span className="text-sm font-bold text-primary tabular-nums">{pair.wins}</span>
                    <span className="text-muted-foreground mx-0.5">/</span>
                    <span className="text-sm font-bold text-tertiary tabular-nums">{pair.losses}</span>
                  </td>
                  <td className="px-3 py-3.5 hidden sm:table-cell">
                    <div className="flex items-center gap-2 min-w-[70px] justify-end">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                          initial={{ width: 0 }}
                          animate={{ width: `${pair.winRate}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground w-8 text-right tabular-nums">{pair.winRate}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground text-sm">
          Nessuna coppia ha ancora raggiunto le {MIN_GAMES} partite per qualificarsi.
        </div>
      )}

      {participants.length > 0 && (
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-sm font-semibold text-muted-foreground">Coppie partecipanti</span>
            <span className="text-xs text-muted-foreground/60 bg-muted rounded-full px-2 py-0.5 whitespace-nowrap">
              min. {MIN_GAMES} partite
            </span>
          </div>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            {participants.map((pair, idx) => (
              <div
                key={pair.id}
                className={`flex items-center justify-between px-4 py-3 ${
                  idx < participants.length - 1 ? "border-b border-border/40" : ""
                }`}
              >
                <PairBadges pair={pair} />
                <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0 ml-2">
                  <span>
                    <span className="text-primary font-semibold">{pair.wins}V</span>
                    {" / "}
                    <span className="text-tertiary font-semibold">{pair.losses}S</span>
                  </span>
                  <span className="bg-muted rounded-full px-2 py-0.5 tabular-nums">
                    {pair.gamesPlayed}/{MIN_GAMES}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
