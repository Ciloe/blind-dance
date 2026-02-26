'use server';

import { saveSessionResult, getPlayerStats as getPlayerStatsBlob, getLeaderboard as getLeaderboardBlob } from '@/lib/blob';
import { SessionResult } from '@/types/stats';

export async function saveStats(
  sessionId: string,
  players: any[],
  totalRounds: number
) {
  try {
    const sessionResult: SessionResult = {
      sessionId,
      completedAt: new Date(),
      totalRounds,
      players,
    };

    await saveSessionResult(sessionResult);

    return {
      success: true,
      message: 'Stats saved successfully',
    };
  } catch (error) {
    console.error('Error saving stats:', error);
    return {
      success: false,
      error: 'Failed to save stats',
    };
  }
}

export async function getPlayerStats(username: string) {
  try {
    const stats = await getPlayerStatsBlob(username);

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return {
      success: false,
      error: 'Failed to fetch stats',
    };
  }
}

export async function getLeaderboard() {
  try {
    const leaderboard = await getLeaderboardBlob(100);

    return {
      success: true,
      data: leaderboard,
    };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return {
      success: false,
      error: 'Failed to fetch leaderboard',
    };
  }
}
