import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { SessionResult, PlayerStats, GameHistory } from '@/types/stats';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const resultsCollection = db.collection<SessionResult>('session_results');

    // Récupérer toutes les parties du joueur
    const results = await resultsCollection
      .find({
        'players.username': username,
      })
      .sort({ completedAt: -1 })
      .toArray();

    if (results.length === 0) {
      return NextResponse.json({
        username,
        totalGames: 0,
        totalWins: 0,
        totalPoints: 0,
        averagePoints: 0,
        bestScore: 0,
        worstScore: 0,
        totalCorrectAnswers: 0,
        totalAnswers: 0,
        accuracyPercentage: 0,
        games: [],
      });
    }

    // Calculer les statistiques
    let totalPoints = 0;
    let totalWins = 0;
    let bestScore = 0;
    let worstScore = Infinity;
    let totalCorrectAnswers = 0;
    let totalAnswers = 0;
    let lastAvatar = results[0].players.find((p) => p.username === username)?.avatar;

    const games: GameHistory[] = results.map((result) => {
      const player = result.players.find((p) => p.username === username)!;
      totalPoints += player.score;
      totalCorrectAnswers += player.correctAnswers;
      totalAnswers += result.totalRounds;

      if (player.position === 1) {
        totalWins++;
      }

      if (player.score > bestScore) {
        bestScore = player.score;
      }

      if (player.score < worstScore) {
        worstScore = player.score;
      }

      if (!lastAvatar) {
        lastAvatar = player.avatar;
      }

      return {
        sessionId: result.sessionId,
        date: result.completedAt,
        position: player.position,
        score: player.score,
        totalRounds: result.totalRounds,
        correctAnswers: player.correctAnswers,
        players: result.players.length,
      };
    });

    const stats: PlayerStats = {
      username,
      avatar: lastAvatar!,
      totalGames: results.length,
      totalWins,
      totalPoints,
      averagePoints: Math.round(totalPoints / results.length),
      bestScore,
      worstScore: worstScore === Infinity ? 0 : worstScore,
      totalCorrectAnswers,
      totalAnswers,
      accuracyPercentage: totalAnswers > 0 ? Math.round((totalCorrectAnswers / totalAnswers) * 100) : 0,
      lastPlayed: results[0].completedAt,
      games,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
