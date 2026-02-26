import { NextResponse } from 'next/server';
import { createSession } from '@/lib/blob';
import { generateSessionId, generatePlayerId } from '@/lib/utils';
import { Session } from '@/types';

export async function POST() {
  try {
    const sessionId = generateSessionId();
    const adminId = generatePlayerId();

    const newSession: Session = {
      sessionId,
      adminId,
      status: 'waiting',
      players: [],
      rounds: [],
      currentRound: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await createSession(newSession);

    return NextResponse.json({
      sessionId,
      adminId,
      message: 'Session created successfully',
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
