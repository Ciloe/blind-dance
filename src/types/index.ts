export type MediaType = 'image' | 'video' | 'audio';

export type GameStatus = 'waiting' | 'playing' | 'scoreboard' | 'finished';

export interface Avatar {
  id: string;
  emoji: string;
  name: string;
}

export interface Player {
  id: string;
  username: string;
  avatar: Avatar;
  score: number;
  isAdmin: boolean;
  joinedAt: Date;
}

export interface Answer {
  playerId: string;
  answer: string;
  answeredAt: Date;
  points: number;
}

export interface Round {
  roundNumber: number;
  mediaUrl: string;
  mediaType: MediaType;
  question: string;
  options: string[];
  correctAnswer: string;
  timeLimit: number; // en secondes
  answers: Answer[];
  startedAt?: Date;
  endedAt?: Date;
}

export interface Session {
  _id?: string;
  sessionId: string;
  adminId: string;
  status: GameStatus;
  players: Player[];
  rounds: Round[];
  currentRound: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerAnswer {
  sessionId: string;
  playerId: string;
  roundNumber: number;
  answer: string;
  timeRemaining: number;
}

export interface ScoreEntry extends Player {
  position: number;
  roundPoints?: number;
}

// Avatars prédéfinis
export const AVATARS: Avatar[] = [
  { id: 'dancer-1', emoji: '💃', name: 'Danseur Salsa' },
  { id: 'dancer-2', emoji: '🕺', name: 'Danseur Disco' },
  { id: 'dancer-3', emoji: '🩰', name: 'Ballerine' },
  { id: 'dancer-4', emoji: '🤸', name: 'Breakdancer' },
  { id: 'dancer-5', emoji: '🎭', name: 'Danseur Hip-Hop' },
  { id: 'dancer-6', emoji: '👯', name: 'Duo Synchronisé' },
  { id: 'dancer-7', emoji: '🎪', name: 'Danseur Cabaret' },
  { id: 'dancer-8', emoji: '🦢', name: 'Cygne' },
  { id: 'dancer-9', emoji: '🐧', name: 'Pingouin Danseur' },
  { id: 'dancer-10', emoji: '🦄', name: 'Licorne Magique' },
  { id: 'dancer-11', emoji: '🤖', name: 'Robot Danseur' },
  { id: 'dancer-12', emoji: '👾', name: 'Alien Groovy' },
];

// Noms aléatoires rigolos
export const RANDOM_NAMES = [
  'DanceKing',
  'RhythmMaster',
  'GroovyGuru',
  'SalsaStar',
  'DiscoQueen',
  'HipHopHero',
  'TapTapper',
  'TwistMaster',
  'FunkyFeet',
  'SwingKing',
  'BoogieWoogie',
  'MoonWalker',
  'BreakBeast',
  'TangoTornado',
  'WaltzWizard',
  'ChaChaChamp',
  'RumbaBoss',
  'FoxtrotFan',
  'JiveJedi',
  'QuickStepQueen',
];
