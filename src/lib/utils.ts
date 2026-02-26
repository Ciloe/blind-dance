import { nanoid } from 'nanoid';
import { RANDOM_NAMES, AVATARS } from '@/types';

/**
 * Génère un ID de session unique
 */
export function generateSessionId(): string {
  return nanoid(10);
}

/**
 * Génère un ID de joueur unique
 */
export function generatePlayerId(): string {
  return nanoid(12);
}

/**
 * Génère un nom de joueur aléatoire
 */
export function generateRandomUsername(): string {
  const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${randomName}${randomNumber}`;
}

/**
 * Sélectionne un avatar aléatoire
 */
export function getRandomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

/**
 * Calcule les points pour une réponse
 * @param isCorrect - Si la réponse est correcte
 * @param timeRemaining - Temps restant en secondes
 * @param timeLimit - Temps limite total en secondes
 * @returns Points obtenus
 */
export function calculatePoints(
  isCorrect: boolean,
  timeRemaining: number,
  timeLimit: number
): number {
  if (!isCorrect) return 0;

  const basePoints = 100;
  const timePercentage = timeRemaining / timeLimit;
  const timeBonus = Math.round(100 * timePercentage);

  return basePoints + timeBonus;
}

/**
 * Formate le temps en MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Mélange un tableau (Fisher-Yates shuffle)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Classe les joueurs par score
 */
export function rankPlayers<T extends { score: number }>(players: T[]): T[] {
  return [...players].sort((a, b) => b.score - a.score);
}
