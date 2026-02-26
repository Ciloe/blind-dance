export interface PlayerStats {
  playerId?: string;
  username: string;
  avatar: {
    id: string;
    emoji: string;
    name: string;
  };
  totalGames: number;
  totalWins: number;
  totalPoints: number;
  averagePoints: number;
  bestScore: number;
  worstScore: number;
  totalCorrectAnswers: number;
  totalAnswers: number;
  accuracyPercentage: number;
  lastPlayed: Date;
  games: GameHistory[];
}

export interface GameHistory {
  sessionId: string;
  date: Date;
  position: number;
  score: number;
  totalRounds: number;
  correctAnswers: number;
  players: number;
}

export interface SessionResult {
  _id?: string;
  sessionId: string;
  completedAt: Date;
  totalRounds: number;
  players: {
    playerId: string;
    username: string;
    avatar: {
      id: string;
      emoji: string;
      name: string;
    };
    score: number;
    position: number;
    correctAnswers: number;
  }[];
}
