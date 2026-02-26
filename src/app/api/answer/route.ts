import { NextRequest, NextResponse } from 'next/server';
import { getSession, addAnswerToRound, updatePlayerScore } from '@/lib/blob';
import { calculatePoints } from '@/lib/utils';
import { Answer } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, playerId, roundNumber, answer, timeRemaining } = await request.json();

    if (!sessionId || !playerId || roundNumber === undefined || !answer) {
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

    const round = session.rounds[roundNumber];
    if (!round) {
      return NextResponse.json(
        { error: 'Round not found' },
        { status: 404 }
      );
    }

    // Vérifier si le joueur a déjà répondu
    const alreadyAnswered = round.answers.some((a: Answer) => a.playerId === playerId);
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

    // Ajouter la réponse
    await addAnswerToRound(sessionId, roundNumber, playerAnswer);

    // Mettre à jour le score du joueur
    await updatePlayerScore(sessionId, playerId, points);

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
