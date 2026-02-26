import { NextRequest, NextResponse } from 'next/server';
import { saveSessionResult } from '@/lib/blob';
import { SessionResult } from '@/types/stats';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, players, totalRounds } = body;

    if (!sessionId || !players || !totalRounds) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sessionResult: SessionResult = {
      sessionId,
      completedAt: new Date(),
      totalRounds,
      players,
    };

    await saveSessionResult(sessionResult);

    return NextResponse.json({
      message: 'Stats saved successfully',
    });
  } catch (error) {
    console.error('Error saving stats:', error);
    return NextResponse.json(
      { error: 'Failed to save stats' },
      { status: 500 }
    );
  }
}
