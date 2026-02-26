import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { SessionResult } from '@/types/stats';

interface LeaderboardEntry {
  username: string;
  avatar: {
    id: string;
    emoji: string;
    name: string;
  };
  totalGames: number;
  totalWins: number;
  totalPoints: number;
  averagePoints: number;
  winRate: number;
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const resultsCollection = db.collection<SessionResult>('session_results');

    // Récupérer toutes les parties
    const results = await resultsCollection.find({}).toArray();

    // Agréger les stats par joueur
    const playerMap = new Map<string, LeaderboardEntry>();

    results.forEach((result) => {
      result.players.forEach((player) => {
        const existing = playerMap.get(player.username);

        if (existing) {
          existing.totalGames++;
          existing.totalPoints += player.score;
          if (player.position === 1) {
            existing.totalWins++;
          }
        } else {
          playerMap.set(player.username, {
            username: player.username,
            avatar: player.avatar,
            totalGames: 1,
            totalWins: player.position === 1 ? 1 : 0,
            totalPoints: player.score,
            averagePoints: player.score,
            winRate: player.position === 1 ? 100 : 0,
          });
        }
      });
    });

    // Calculer les moyennes et taux de victoire
    const leaderboard = Array.from(playerMap.values()).map((entry) => ({
      ...entry,
      averagePoints: Math.round(entry.totalPoints / entry.totalGames),
      winRate: Math.round((entry.totalWins / entry.totalGames) * 100),
    }));

    // Trier par points totaux
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

    return NextResponse.json(leaderboard.slice(0, 100)); // Top 100
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
