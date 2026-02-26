import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { calculatePoints } from '@/lib/utils';
import { Session, Answer } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, playerId, roundNumber, answer, timeRemaining } = await request.json();

    if (!sessionId || !playerId || roundNumber === undefined || !answer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const sessionsCollection = db.collection<Session>('sessions');

    const session = await sessionsCollection.findOne({ sessionId });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const round = session.rounds[roundNumber];
    if (!round) {
      return NextResponse.json(
        { error: 'Round not found' },
        { status: 404 }
      );
    }

    // Vérifier si le joueur a déjà répondu
    const alreadyAnswered = round.answers.some((a) => a.playerId === playerId);
    if (alreadyAnswered) {
      return NextResponse.json(
        { error: 'Player has already answered' },
        { status: 400 }
      );
    }

    // Calculer les points
    const isCorrect = answer === round.correctAnswer;
    const points = calculatePoints(isCorrect, timeRemaining, round.timeLimit);

    const playerAnswer: Answer = {
      playerId,
      answer,
      answeredAt: new Date(),
      points,
    };

    // Mettre à jour la réponse dans le round
    await sessionsCollection.updateOne(
      { sessionId },
      {
        $push: { [`rounds.${roundNumber}.answers`]: playerAnswer },
        $set: { updatedAt: new Date() },
      }
    );

    // Mettre à jour le score du joueur
    await sessionsCollection.updateOne(
      { sessionId, 'players.id': playerId },
      {
        $inc: { 'players.$.score': points },
      }
    );

    return NextResponse.json({
      points,
      isCorrect,
      message: 'Answer submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
