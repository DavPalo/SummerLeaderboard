import { prisma } from "@/lib/prisma";
import type { LeaderboardEntry } from "@/components/leaderboard/TopThree";

const MIN_GAMES = 10;

export interface SplitLeaderboard {
  qualified: LeaderboardEntry[];
  participants: LeaderboardEntry[];
}

export interface PairEntry {
  id: string;
  nameA: string;
  nameB: string;
  emojiA: string;
  emojiB: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  winRate: number;
}

export interface SplitPairsLeaderboard {
  qualified: PairEntry[];
  participants: PairEntry[];
}

function sortByWinRate(a: LeaderboardEntry, b: LeaderboardEntry) {
  return b.winRate - a.winRate || b.wins - a.wins;
}

function sortPairsByWinRate(a: PairEntry, b: PairEntry) {
  return b.winRate - a.winRate || b.wins - a.wins;
}

export async function getSchiaccia7Leaderboard(): Promise<SplitLeaderboard> {
  const players = await prisma.player.findMany({
    include: {
      schiacciaParticipations: true,
    },
    orderBy: { name: "asc" },
  });

  const entries = players
    .filter((p) => p.schiacciaParticipations.length > 0)
    .map((p) => {
      const gamesPlayed = p.schiacciaParticipations.length;
      const wins = p.schiacciaParticipations.filter((part) => part.isWinner).length;
      const losses = gamesPlayed - wins;
      return {
        id: p.id,
        name: p.name,
        emoji: p.emoji,
        wins,
        losses,
        gamesPlayed,
        winRate: gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0,
      };
    });

  const qualified = entries.filter((e) => e.gamesPlayed >= MIN_GAMES).sort(sortByWinRate);
  const participants = entries.filter((e) => e.gamesPlayed < MIN_GAMES).sort(sortByWinRate);

  return { qualified, participants };
}

export async function getSinglesLeaderboard(): Promise<SplitLeaderboard> {
  const players = await prisma.player.findMany({
    include: {
      singlesAsPlayer1: true,
      singlesAsPlayer2: true,
      singlesAsWinner: true,
    },
    orderBy: { name: "asc" },
  });

  const entries = players
    .filter((p) => p.singlesAsPlayer1.length + p.singlesAsPlayer2.length > 0)
    .map((p) => {
      const gamesPlayed = p.singlesAsPlayer1.length + p.singlesAsPlayer2.length;
      const wins = p.singlesAsWinner.length;
      const losses = gamesPlayed - wins;
      return {
        id: p.id,
        name: p.name,
        emoji: p.emoji,
        wins,
        losses,
        gamesPlayed,
        winRate: gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0,
      };
    });

  const qualified = entries.filter((e) => e.gamesPlayed >= MIN_GAMES).sort(sortByWinRate);
  const participants = entries.filter((e) => e.gamesPlayed < MIN_GAMES).sort(sortByWinRate);

  return { qualified, participants };
}

// ─── Doppio ──────────────────────────────────────────────────────────────────

/** Classifica per COPPIA — quante volte ha vinto ogni coppia insieme */
export async function getDoublesPairsLeaderboard(): Promise<SplitPairsLeaderboard> {
  const matches = await prisma.pingPongDoubles.findMany({
    include: {
      team1PlayerA: true,
      team1PlayerB: true,
      team2PlayerA: true,
      team2PlayerB: true,
    },
    orderBy: { playedAt: "desc" },
  });

  const teamStats = new Map<
    string,
    { nameA: string; nameB: string; emojiA: string; emojiB: string; wins: number; losses: number }
  >();

  for (const match of matches) {
    const teams: Array<{ ids: string[]; isTeam1: boolean }> = [
      { ids: [match.team1PlayerAId, match.team1PlayerBId].sort(), isTeam1: true },
      { ids: [match.team2PlayerAId, match.team2PlayerBId].sort(), isTeam1: false },
    ];

    for (const { ids, isTeam1 } of teams) {
      const key = ids.join("_");
      if (!teamStats.has(key)) {
        const [aId] = ids;
        let pA, pB;
        if (isTeam1) {
          pA = aId === match.team1PlayerAId ? match.team1PlayerA : match.team1PlayerB;
          pB = aId === match.team1PlayerAId ? match.team1PlayerB : match.team1PlayerA;
        } else {
          pA = aId === match.team2PlayerAId ? match.team2PlayerA : match.team2PlayerB;
          pB = aId === match.team2PlayerAId ? match.team2PlayerB : match.team2PlayerA;
        }
        teamStats.set(key, { nameA: pA.name, nameB: pB.name, emojiA: pA.emoji, emojiB: pB.emoji, wins: 0, losses: 0 });
      }
      const stat = teamStats.get(key)!;
      const won = isTeam1 ? match.winnerTeam === 1 : match.winnerTeam === 2;
      if (won) stat.wins++; else stat.losses++;
    }
  }

  const entries = Array.from(teamStats.entries()).map(([key, s]) => ({
    id: key,
    nameA: s.nameA,
    nameB: s.nameB,
    emojiA: s.emojiA,
    emojiB: s.emojiB,
    wins: s.wins,
    losses: s.losses,
    gamesPlayed: s.wins + s.losses,
    winRate: s.wins + s.losses > 0 ? Math.round((s.wins / (s.wins + s.losses)) * 100) : 0,
  }));

  const qualified = entries.filter((e) => e.gamesPlayed >= MIN_GAMES).sort(sortPairsByWinRate);
  const participants = entries.filter((e) => e.gamesPlayed < MIN_GAMES).sort(sortPairsByWinRate);

  return { qualified, participants };
}

/** Classifica INDIVIDUALE nel doppio — quante vittorie ha accumulato ogni giocatore in partite di doppio */
export async function getDoublesIndividualLeaderboard(): Promise<SplitLeaderboard> {
  const matches = await prisma.pingPongDoubles.findMany({
    include: {
      team1PlayerA: true,
      team1PlayerB: true,
      team2PlayerA: true,
      team2PlayerB: true,
    },
  });

  const stats = new Map<string, { name: string; emoji: string; wins: number; losses: number }>();

  for (const match of matches) {
    const teams = [
      { players: [{ id: match.team1PlayerAId, p: match.team1PlayerA }, { id: match.team1PlayerBId, p: match.team1PlayerB }], won: match.winnerTeam === 1 },
      { players: [{ id: match.team2PlayerAId, p: match.team2PlayerA }, { id: match.team2PlayerBId, p: match.team2PlayerB }], won: match.winnerTeam === 2 },
    ];

    for (const { players, won } of teams) {
      for (const { id, p } of players) {
        if (!stats.has(id)) stats.set(id, { name: p.name, emoji: p.emoji, wins: 0, losses: 0 });
        const s = stats.get(id)!;
        if (won) s.wins++; else s.losses++;
      }
    }
  }

  const entries = Array.from(stats.entries()).map(([id, s]) => ({
    id,
    name: s.name,
    emoji: s.emoji,
    wins: s.wins,
    losses: s.losses,
    gamesPlayed: s.wins + s.losses,
    winRate: s.wins + s.losses > 0 ? Math.round((s.wins / (s.wins + s.losses)) * 100) : 0,
  }));

  const qualified = entries.filter((e) => e.gamesPlayed >= MIN_GAMES).sort(sortByWinRate);
  const participants = entries.filter((e) => e.gamesPlayed < MIN_GAMES).sort(sortByWinRate);

  return { qualified, participants };
}
