import { put, del, list, get } from '@vercel/blob';
import { Session } from '@/types';
import { SessionResult } from '@/types/stats';

// Cache des URLs de blobs en mémoire (pour éviter les list() répétés)
const urlCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute

// Chemins dans le blob store
const PATHS = {
  session: (sessionId: string) => `sessions/${sessionId}.json`,
  sessionResult: (sessionId: string) => `results/${sessionId}.json`,
  playerStats: (username: string) => `stats/players/${username}.json`,
  leaderboard: 'stats/leaderboard.json',
  sessionsList: 'sessions/list.json',
};

/**
 * Helper pour obtenir l'URL d'un blob
 */
async function getBlobUrl(path: string): Promise<string | null> {
  // Vérifier le cache
  const cached = urlCache.get(path);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.url;
  }

  try {
    // Lister TOUS les blobs (pas de prefix pour éviter les problèmes)
    const { blobs } = await list();

    if (blobs.length > 0) {
      console.log(`📋 All blob pathnames:`, blobs.map(b => b.pathname));
    }

    // Chercher le blob qui correspond exactement au path
    const blob = blobs.find(b => b.pathname === path);

    if (!blob) {
      console.log(`❌ Blob not found: ${path}`);
      console.log(`Available pathnames:`, blobs.map(b => b.pathname));
      return null;
    }

    // Mettre en cache
    urlCache.set(path, { url: blob.url, timestamp: Date.now() });
    return blob.url;
  } catch (error) {
    console.error(`❌ Error getting blob URL for ${path}:`, error);
    return null;
  }
}

/**
 * Helper pour lire un blob JSON
 */
async function getBlob<T>(path: string): Promise<T | null> {
  try {
    // Utiliser list pour trouver le blob
    const { blobs } = await list({ prefix: path });

    if (blobs.length === 0) {
      console.log(`❌ No blobs found with prefix: ${path}`);
      return null;
    }

    // Trouver le blob exact
    const blob = blobs.find(b => b.pathname === path);

    if (!blob) {
      console.log(`❌ Exact blob not found: ${path}`);
      console.log(`Available:`, blobs.map(b => b.pathname));
      return null;
    }

    const response = await get(blob.url, {access: "public"});
    if (!response || response.statusCode !== 200) {
      console.log(`❌ Failed to fetch blob: ${blob.url}`);
      return null;
    }

    const text = await NextResponse(response.stream, {
      headers: {
        'Content-Type': result.blob.contentType,
      },
    });
    const data = JSON.parse(text) as T;

    console.log(`✅ Blob read successfully`);
    return data;
  } catch (error) {
    console.error(`❌ Error reading blob ${path}:`, error);
    return null;
  }
}

/**
 * Helper pour écrire un blob JSON
 */
async function putBlob(path: string, data: any): Promise<string> {
  try {
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const result = await put(path, blob, {
      access: 'public',
      addRandomSuffix: false, // Garder le nom exact
    });

    // Mettre en cache l'URL
    urlCache.set(path, { url: result.url, timestamp: Date.now() });

    return result.url;
  } catch (error) {
    console.error(`Error writing blob ${path}:`, error);
    throw error;
  }
}

/**
 * Sessions
 */

export async function createSession(session: Session): Promise<void> {
  try {
    const path = PATHS.session(session.sessionId);

    // Supprimer le blob s'il existe déjà (au cas où)
    const existingUrl = await getBlobUrl(path);
    if (existingUrl) {
      await del(existingUrl);
      urlCache.delete(path);
    }

    // Créer la session
    await putBlob(path, session);

    // Ajouter à la liste des sessions actives
    const sessionsList = await getBlob<string[]>(PATHS.sessionsList) || [];
    if (!sessionsList.includes(session.sessionId)) {
      sessionsList.push(session.sessionId);

      // Supprimer l'ancienne liste si elle existe
      const listUrl = await getBlobUrl(PATHS.sessionsList);
      if (listUrl) {
        await del(listUrl);
        urlCache.delete(PATHS.sessionsList);
      }

      await putBlob(PATHS.sessionsList, sessionsList);
    }
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

export async function getSession(sessionId: string): Promise<Session | null> {
  try {
    return await getBlob<Session>(PATHS.session(sessionId));
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function updateSession(
  sessionId: string,
  updates: Partial<Session>
): Promise<void> {
  try {
    const session = await getSession(sessionId);

    if (!session) {
      console.error('Session not found for update:', sessionId);
      throw new Error('Session not found');
    }

    const updatedSession: Session = {
      ...session,
      ...updates,
      updatedAt: new Date(),
    };

    // Supprimer l'ancien blob d'abord
    const oldUrl = await getBlobUrl(PATHS.session(sessionId));
    if (oldUrl) {
      console.log('Deleting old blob:', oldUrl);
      await del(oldUrl);
      // Invalider le cache
      urlCache.delete(PATHS.session(sessionId));
    }

    // Créer le nouveau blob
    await putBlob(PATHS.session(sessionId), updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  await del(PATHS.session(sessionId));

  // Retirer de la liste
  const sessionsList = await getBlob<string[]>(PATHS.sessionsList) || [];
  const filtered = sessionsList.filter(id => id !== sessionId);
  await putBlob(PATHS.sessionsList, filtered);
}

export async function getAllSessions(): Promise<string[]> {
  return await getBlob<string[]>(PATHS.sessionsList) || [];
}

/**
 * Statistiques
 */

export async function saveSessionResult(result: SessionResult): Promise<void> {
  // Sauvegarder le résultat
  await putBlob(PATHS.sessionResult(result.sessionId), result);

  // Mettre à jour les stats de chaque joueur
  for (const player of result.players) {
    await updatePlayerStats(player.username, result);
  }

  // Mettre à jour le leaderboard
  await updateLeaderboard(result);
}

async function updatePlayerStats(
  username: string,
  result: SessionResult
): Promise<void> {
  const player = result.players.find((p) => p.username === username);
  if (!player) return;

  const existing = await getBlob<any>(PATHS.playerStats(username));

  let stats: any = existing || {
    username,
    avatar: player.avatar,
    totalGames: 0,
    totalWins: 0,
    totalPoints: 0,
    totalCorrectAnswers: 0,
    totalAnswers: 0,
    bestScore: 0,
    worstScore: Infinity,
    gameIds: [],
  };

  // Mettre à jour les stats
  stats.totalGames++;
  stats.totalPoints += player.score;
  stats.totalCorrectAnswers += player.correctAnswers;
  stats.totalAnswers += result.totalRounds;
  stats.avatar = player.avatar;
  stats.lastPlayed = result.completedAt;

  if (player.position === 1) {
    stats.totalWins++;
  }

  if (player.score > stats.bestScore) {
    stats.bestScore = player.score;
  }

  if (player.score < stats.worstScore) {
    stats.worstScore = player.score;
  }

  if (!stats.gameIds) stats.gameIds = [];
  stats.gameIds.push(result.sessionId);

  stats.averagePoints = Math.round(stats.totalPoints / stats.totalGames);
  stats.accuracyPercentage = stats.totalAnswers > 0
    ? Math.round((stats.totalCorrectAnswers / stats.totalAnswers) * 100)
    : 0;

  await putBlob(PATHS.playerStats(username), stats);
}

async function updateLeaderboard(result: SessionResult): Promise<void> {
  const leaderboard = await getBlob<any[]>(PATHS.leaderboard) || [];

  for (const player of result.players) {
    const stats = await getBlob<any>(PATHS.playerStats(player.username));
    if (!stats) continue;

    // Mettre à jour ou ajouter le joueur
    const existingIndex = leaderboard.findIndex(
      (entry) => entry.username === player.username
    );

    const entry = {
      username: stats.username,
      avatar: stats.avatar,
      totalGames: stats.totalGames,
      totalWins: stats.totalWins,
      totalPoints: stats.totalPoints,
      averagePoints: stats.averagePoints,
      winRate: stats.totalGames > 0
        ? Math.round((stats.totalWins / stats.totalGames) * 100)
        : 0,
    };

    if (existingIndex >= 0) {
      leaderboard[existingIndex] = entry;
    } else {
      leaderboard.push(entry);
    }
  }

  // Trier par points totaux
  leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

  // Garder seulement le top 100
  const top100 = leaderboard.slice(0, 100);

  await putBlob(PATHS.leaderboard, top100);
}

export async function getPlayerStats(username: string): Promise<any> {
  const stats = await getBlob<any>(PATHS.playerStats(username));

  if (!stats) {
    return {
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
    };
  }

  // Récupérer les détails des parties
  const games = await Promise.all(
    (stats.gameIds || []).slice(0, 50).map(async (gameId: string) => {
      const result = await getBlob<any>(PATHS.sessionResult(gameId));
      if (!result) return null;

      const player = result.players.find((p: any) => p.username === username);

      return {
        sessionId: result.sessionId,
        date: result.completedAt,
        position: player.position,
        score: player.score,
        totalRounds: result.totalRounds,
        correctAnswers: player.correctAnswers,
        players: result.players.length,
      };
    })
  );

  return {
    ...stats,
    games: games.filter(Boolean),
  };
}

export async function getLeaderboard(limit: number = 100): Promise<any[]> {
  const leaderboard = await getBlob<any[]>(PATHS.leaderboard) || [];
  return leaderboard.slice(0, limit);
}

/**
 * Helper pour ajouter un joueur à une session
 */
export async function addPlayerToSession(
  sessionId: string,
  player: any
): Promise<void> {
  const session = await getSession(sessionId);
  if (!session) throw new Error('Session not found');

  session.players.push(player);
  session.updatedAt = new Date();

  await updateSession(sessionId, { players: session.players });
}

/**
 * Helper pour ajouter une réponse à un round
 */
export async function addAnswerToRound(
  sessionId: string,
  roundNumber: number,
  answer: any
): Promise<void> {
  const session = await getSession(sessionId);
  if (!session) throw new Error('Session not found');

  if (!session.rounds[roundNumber]) {
    throw new Error('Round not found');
  }

  session.rounds[roundNumber].answers.push(answer);
  session.updatedAt = new Date();

  await updateSession(sessionId, { rounds: session.rounds });
}

/**
 * Helper pour mettre à jour le score d'un joueur
 */
export async function updatePlayerScore(
  sessionId: string,
  playerId: string,
  pointsToAdd: number
): Promise<void> {
  const session = await getSession(sessionId);
  if (!session) throw new Error('Session not found');

  const player = session.players.find((p) => p.id === playerId);
  if (!player) throw new Error('Player not found');

  player.score += pointsToAdd;
  session.updatedAt = new Date();

  await updateSession(sessionId, { players: session.players });
}
