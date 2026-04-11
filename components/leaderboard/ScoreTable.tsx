"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "./TopThree";

interface ScoreTableProps {
  entries: LeaderboardEntry[];
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-xl">🥇</span>;
  if (rank === 2) return <span className="text-xl">🥈</span>;
  if (rank === 3) return <span className="text-xl">🥉</span>;
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
      {rank}
    </span>
  );
}

function WinRateBar({ rate }: { rate: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[70px]">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${rate}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-semibold text-muted-foreground w-8 text-right tabular-nums">{rate}%</span>
    </div>
  );
}

export function ScoreTable({ entries }: ScoreTableProps) {
  if (entries.length === 0) return null;

  // Show from 4th place onwards (top 3 shown in podium)
  const rest = entries.slice(3);
  if (rest.length === 0) return null;

  return (
    <div className="mt-2 rounded-xl border border-border overflow-hidden">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-10">#</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Giocatore</th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">
              <span className="text-primary">V</span>/<span className="text-tertiary">S</span>
            </th>
            <th className="px-3 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-20 hidden sm:table-cell">Win %</th>
          </tr>
        </thead>
        <tbody>
          {rest.map((entry, idx) => {
            const rank = idx + 4;
            return (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={cn(
                  "border-b border-border/50 transition-colors hover:bg-accent/50",
                  idx === rest.length - 1 && "border-b-0"
                )}
              >
                <td className="px-3 py-3.5">
                  <RankBadge rank={rank} />
                </td>
                <td className="px-3 py-3.5 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg shrink-0">{entry.emoji ?? "🏅"}</span>
                    <span className="font-semibold text-sm truncate">{entry.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-center">
                  <span className="text-sm font-bold text-primary tabular-nums">{entry.wins}</span>
                  <span className="text-muted-foreground mx-0.5">/</span>
                  <span className="text-sm font-bold text-tertiary tabular-nums">{entry.losses}</span>
                </td>
                <td className="px-3 py-3.5 hidden sm:table-cell">
                  <WinRateBar rate={entry.winRate} />
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
