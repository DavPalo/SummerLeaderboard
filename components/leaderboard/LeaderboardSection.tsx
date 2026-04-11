"use client";

import { TopThree } from "./TopThree";
import { ScoreTable } from "./ScoreTable";
import type { LeaderboardEntry } from "./TopThree";

const MIN_GAMES = 10;

interface LeaderboardSectionProps {
  qualified: LeaderboardEntry[];
  participants: LeaderboardEntry[];
}

export function LeaderboardSection({ qualified, participants }: LeaderboardSectionProps) {
  return (
    <div className="space-y-2">
      <TopThree entries={qualified} />
      <ScoreTable entries={qualified} />

      {participants.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="flex items-center gap-2 mb-4 mt-4 flex-wrap">
            <span className="text-sm font-semibold text-muted-foreground">Partecipanti</span>
            <span className="text-xs text-muted-foreground/60 bg-muted rounded-full px-2 py-0.5 whitespace-nowrap">
              min. {MIN_GAMES} partite
            </span>
          </div>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            {participants.map((p, idx) => (
              <div
                key={p.id}
                className={`flex items-center justify-between px-4 py-3 ${
                  idx < participants.length - 1 ? "border-b border-border/40" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{p.emoji ?? "🏅"}</span>
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    <span className="text-primary font-semibold">{p.wins}V</span>
                    {" / "}
                    <span className="text-tertiary font-semibold">{p.losses}S</span>
                  </span>
                  <span className="bg-muted rounded-full px-2 py-0.5 tabular-nums">
                    {p.gamesPlayed}/{MIN_GAMES}
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
