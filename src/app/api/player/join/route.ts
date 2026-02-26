import { NextRequest, NextResponse } from 'next/server';
import { getSession, addPlayerToSession } from '@/lib/blob';
import { generatePlayerId } from '@/lib/utils';
import { Player } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, username, avatar } = await request.json();

    if (!sessionId || !username || !avatar) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await getSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (session.status !== 'waiting') {
      return NextResponse.json(
        { error: 'Session has already started' },
        { status: 400 }
      );
    }

    const playerId = generatePlayerId();

    const newPlayer: Player = {
      id: playerId,
      username,
      avatar,
      score: 0,
      isAdmin: false,
      joinedAt: new Date(),
    };

    await addPlayerToSession(sessionId, newPlayer);

    return NextResponse.json({
      playerId,
      message: 'Player joined successfully',
    });
  } catch (error) {
    console.error('Error joining session:', error);
    return NextResponse.json(
      { error: 'Failed to join session' },
      { status: 500 }
    );
  }
}
