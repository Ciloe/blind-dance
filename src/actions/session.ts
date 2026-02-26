'use server';

import {
  createSession as createSessionBlob,
  getSession as getSessionBlob,
  updateSession as updateSessionBlob,
  addPlayerToSession,
  addAnswerToRound,
  updatePlayerScore,
} from '@/lib/blob';
import { generateSessionId, generatePlayerId, calculatePoints } from '@/lib/utils';
import { Session, Player, Answer } from '@/types';

export async function createSession() {
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

    await createSessionBlob(newSession);

    return {
      success: true,
      data: { sessionId, adminId },
    };
  } catch (error) {
    console.error('Error creating session:', error);
    return {
      success: false,
      error: 'Failed to create session',
    };
  }
}

export async function getSession(sessionId: string) {
  try {
    const session = await getSessionBlob(sessionId);

    if (!session) {
      return {
        success: false,
        error: 'Session not found',
      };
    }

    return {
      success: true,
      data: session,
    };
  } catch (error) {
    console.error('Error fetching session:', error);
    return {
      success: false,
      error: 'Failed to fetch session',
    };
  }
}

export async function updateSession(sessionId: string, updates: Partial<Session>) {
  try {
    await updateSessionBlob(sessionId, updates);

    return {
      success: true,
      message: 'Session updated successfully',
    };
  } catch (error) {
    console.error('Error updating session:', error);
    return {
      success: false,
      error: error instanceof Error && error.message === 'Session not found'
        ? 'Session not found'
        : 'Failed to update session',
    };
  }
}

export async function joinSession(
  sessionId: string,
  username: string,
  avatar: any
) {
  try {
    const session = await getSessionBlob(sessionId);

    if (!session) {
      return {
        success: false,
        error: 'Session not found',
      };
    }

    if (session.status !== 'waiting') {
      return {
        success: false,
        error: 'Session has already started',
      };
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

    return {
      success: true,
      data: { playerId },
    };
  } catch (error) {
    console.error('Error joining session:', error);
    return {
      success: false,
      error: 'Failed to join session',
    };
  }
}

export async function submitAnswer(
  sessionId: string,
  playerId: string,
  roundNumber: number,
  answer: string,
  timeRemaining: number
) {
  try {
    const session = await getSessionBlob(sessionId);

    if (!session) {
      return {
        success: false,
        error: 'Session not found',
      };
    }

    const round = session.rounds[roundNumber];
    if (!round) {
      return {
        success: false,
        error: 'Round not found',
      };
    }

    // Vérifier si le joueur a déjà répondu
    const alreadyAnswered = round.answers.some((a: Answer) => a.playerId === playerId);
    if (alreadyAnswered) {
      return {
        success: false,
        error: 'Player has already answered',
      };
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

    return {
      success: true,
      data: { points, isCorrect },
    };
  } catch (error) {
    console.error('Error submitting answer:', error);
    return {
      success: false,
      error: 'Failed to submit answer',
    };
  }
}
