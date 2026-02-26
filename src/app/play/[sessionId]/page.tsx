'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Dices, BarChart3 } from 'lucide-react';
import AvatarSelector from '@/components/AvatarSelector';
import PlayerQueue from '@/components/PlayerQueue';
import GameRound from '@/components/GameRound';
import Scoreboard from '@/components/Scoreboard';
import Podium from '@/components/Podium';
import { Avatar, Session, ScoreEntry } from '@/types';
import { generateRandomUsername, getRandomAvatar, rankPlayers } from '@/lib/utils';
import { AVATARS } from '@/types';
import { useSession } from '@/hooks/useSession';
import { getSession, joinSession } from '@/actions/session';

export default function PlayPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(AVATARS[0]);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState('');
  const [initialSession, setInitialSession] = useState<Session | null>(null);
  const [initialLoading, setInitialLoading] = useState(false);

  // Fetch initial de la session après avoir rejoint
  useEffect(() => {
    if (!hasJoined) return;

    const fetchInitialSession = async () => {
      setInitialLoading(true);
      try {
        const response = await fetch(`/api/session/${resolvedParams.sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setInitialSession(data);
        }
      } catch (error) {
        console.error('Error fetching initial session:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialSession();
  }, [resolvedParams.sessionId, hasJoined]);

  // Utiliser le hook useSession pour les mises à jour en temps réel via SSE
  const { session: liveSession, error: sessionError } = useSession(
    resolvedParams.sessionId,
    hasJoined && !initialLoading
  );

  // Utiliser la session live si disponible, sinon la session initiale
  const session = liveSession || initialSession;

  const handleRandomUsername = () => {
    setUsername(generateRandomUsername());
  };

  const handleRandomAvatar = () => {
    setSelectedAvatar(getRandomAvatar());
  };

  const handleJoinSession = async () => {
    if (!username.trim()) {
      setError('Veuillez entrer un pseudo');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      const result = await joinSession(
        resolvedParams.sessionId,
        username.trim(),
        selectedAvatar
      );

      if (result.success && result.data) {
        setPlayerId(result.data.playerId);
        setHasJoined(true);
        // Stocker dans localStorage pour persistance
        localStorage.setItem(
          `player_${resolvedParams.sessionId}`,
          JSON.stringify({ playerId: result.data.playerId, username, avatar: selectedAvatar })
        );
      } else {
        setError(result.error || 'Erreur lors de la connexion');
      }
    } catch (error) {
      console.error('Error joining session:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsJoining(false);
    }
  };

  // Vérifier si le joueur a déjà rejoint
  useEffect(() => {
    const storedPlayer = localStorage.getItem(`player_${resolvedParams.sessionId}`);
    if (storedPlayer) {
      const { playerId, username, avatar } = JSON.parse(storedPlayer);
      setPlayerId(playerId);
      setUsername(username);
      setSelectedAvatar(avatar);
      setHasJoined(true);
    }
  }, [resolvedParams.sessionId]);

  // Page de connexion
  if (!hasJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💃</div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Rejoindre la partie
              </h1>
              <p className="text-gray-600">Session: {resolvedParams.sessionId}</p>
            </div>

            <div className="space-y-6">
              {/* Pseudo */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Votre pseudo
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleJoinSession()}
                    placeholder="Entrez votre pseudo"
                    className="input-field flex-1"
                    maxLength={20}
                  />
                  <button
                    onClick={handleRandomUsername}
                    className="p-3 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                    title="Pseudo aléatoire"
                  >
                    <Dices className="w-6 h-6 text-purple-600" />
                  </button>
                </div>
              </div>

              {/* Avatar */}
              <AvatarSelector
                selectedAvatar={selectedAvatar}
                onSelectAvatar={setSelectedAvatar}
              />

              <button
                onClick={handleRandomAvatar}
                className="w-full btn-secondary text-sm"
              >
                <Dices className="w-4 h-4 inline mr-2" />
                Avatar aléatoire
              </button>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center">
                  {error}
                </div>
              )}

              <button
                onClick={handleJoinSession}
                disabled={isJoining || !username.trim()}
                className="w-full btn-primary text-lg"
              >
                {isJoining ? 'Connexion...' : 'Rejoindre la partie'}
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/')}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              ← Retour à l&apos;accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chargement de la session
  if (hasJoined && (initialLoading || !session)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">💃</div>
          <p className="text-xl text-gray-600">Chargement de la session...</p>
        </div>
      </div>
    );
  }

  // File d'attente
  if (session && session.status === 'waiting') {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              En attente du démarrage
            </h1>
            <p className="text-gray-600">
              L&apos;administrateur va bientôt lancer la partie...
            </p>
          </div>

          <PlayerQueue players={session.players} adminId={session.adminId} />

          <div className="text-center mt-8">
            <div className="inline-block animate-bounce text-4xl">⏳</div>
          </div>
        </div>
      </div>
    );
  }

  // Jeu en cours
  if (session && session.status === 'playing' && playerId) {
    const currentRound = session.rounds[session.currentRound];
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <GameRound
            round={currentRound}
            roundNumber={session.currentRound}
            sessionId={session.sessionId}
            playerId={playerId}
          />
        </div>
      </div>
    );
  }

  // Tableau des scores entre les rounds
  if (session && session.status === 'scoreboard') {
    const rankedPlayers = rankPlayers(session.players);
    const scores: ScoreEntry[] = rankedPlayers.map((player, index) => ({
      ...player,
      position: index + 1,
    }));

    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Classement Round {session.currentRound + 1}
            </h1>
            <p className="text-gray-600">
              En attente du prochain round...
            </p>
          </div>

          <Scoreboard scores={scores} showRoundPoints={true} />

          <div className="text-center mt-8">
            <div className="inline-block animate-bounce text-4xl">⏳</div>
          </div>
        </div>
      </div>
    );
  }

  // Podium final
  if (session && session.status === 'finished') {
    const rankedPlayers = rankPlayers(session.players);
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Podium players={rankedPlayers} />

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
              onClick={() => router.push(`/stats?username=${encodeURIComponent(username)}`)}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Voir mes stats</span>
            </button>
            <button
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
