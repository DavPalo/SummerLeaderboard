"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LeaderboardEntry {
  id: string;
  name: string;
  emoji?: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  winRate: number;
}

interface TopThreeProps {
  entries: LeaderboardEntry[];
}

export function TopThree({ entries }: TopThreeProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-4xl mb-3">🏁</p>
        <p className="text-sm">Nessun dato disponibile ancora.</p>
      </div>
    );
  }

  const [first, second, third] = entries.slice(0, 3);

  return (
    <div className="py-4 space-y-3">
      {/* 1st place — full width hero */}
      {first && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative rounded-2xl border border-[#F59E0B]/40 bg-gradient-to-b from-[#F59E0B]/20 to-[#F59E0B]/5 shadow-[0_0_30px_rgba(245,158,11,0.25)] p-5 text-center"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥇</div>
          <div className="mt-2 text-5xl mb-2">{first.emoji ?? "🏅"}</div>
          <p className="text-base font-black text-foreground">{first.name}</p>
          <div className="mt-1 flex items-baseline justify-center gap-1">
            <span className="text-3xl font-black text-[#F59E0B]">{first.wins}</span>
            <span className="text-xs text-muted-foreground">wins</span>
          </div>
          <p className="text-xs text-muted-foreground">{first.winRate}% win rate · {first.losses} perse</p>
        </motion.div>
      )}

      {/* 2nd and 3rd — side by side */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { entry: second, emoji: "🥈", color: "text-[#94A3B8]", border: "border-[#94A3B8]/40", bg: "from-[#94A3B8]/20 to-[#94A3B8]/5", delay: 0.15 },
          { entry: third,  emoji: "🥉", color: "text-[#CD7C2F]", border: "border-[#CD7C2F]/40", bg: "from-[#CD7C2F]/20 to-[#CD7C2F]/5", delay: 0.25 },
        ].map(({ entry, emoji, color, border, bg, delay }) =>
          entry ? (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay }}
              className={cn(
                "relative rounded-2xl border bg-gradient-to-b p-4 text-center",
                border,
                bg
              )}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl">{emoji}</div>
              <div className="mt-2 text-3xl mb-1">{entry.emoji ?? "🏅"}</div>
              <p className="text-xs font-bold text-foreground truncate">{entry.name}</p>
              <div className={cn("mt-1 text-xl font-black", color)}>
                {entry.wins}
                <span className="text-xs font-normal text-muted-foreground ml-1">wins</span>
              </div>
              <p className="text-xs text-muted-foreground">{entry.winRate}% · {entry.losses} perse</p>
            </motion.div>
          ) : (
            <div key={`empty-${emoji}`} />
          )
        )}
      </div>
    </div>
  );
}
