'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Play, SkipForward, Settings, Users, Plus, Trash2, BarChart3 } from 'lucide-react';
import PlayerQueue from '@/components/PlayerQueue';
import { Session, Round, MediaType } from '@/types';
import { useSession } from '@/hooks/useSession';
import { rankPlayers } from '@/lib/utils';
import { getSession, updateSession } from '@/actions/session';
import { saveStats } from '@/actions/stats';

export default function AdminPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [adminId, setAdminId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [initialSession, setInitialSession] = useState<Session | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const sessionUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/play/${resolvedParams.sessionId}`;

  // Fetch initial de la session au montage du composant
  useEffect(() => {
    const fetchInitialSession = async () => {
      try {
        const result = await getSession(resolvedParams.sessionId);

        if (result.success && result.data) {
          setInitialSession(result.data);
          setRounds(result.data.rounds || []);
          setAdminId(result.data.adminId);
        } else {
          setFetchError(result.error || 'Session non trouvée');
        }
      } catch (error) {
        console.error('Error fetching initial session:', error);
        setFetchError('Erreur de chargement');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialSession();
  }, [resolvedParams.sessionId]);

  // Utiliser le hook useSession pour les mises à jour en temps réel via SSE
  // Activé seulement après le chargement initial
  const { session: liveSession, error: sessionError } = useSession(
    resolvedParams.sessionId,
    !initialLoading && initialSession !== null
  );

  // Utiliser la session live si disponible, sinon la session initiale
  const session = liveSession || initialSession;

  // Mettre à jour les rounds depuis la session live
  useEffect(() => {
    if (liveSession) {
      setRounds(liveSession.rounds || []);
      setAdminId(liveSession.adminId);
    }
  }, [liveSession]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddRound = () => {
    const newRound: Round = {
      roundNumber: rounds.length,
      mediaUrl: '',
      mediaType: 'video',
      question: 'Quel est ce type de danse ?',
      options: ['Salsa', 'Hip-Hop', 'Ballet', 'Tango', 'Breakdance'],
      correctAnswer: 'Salsa',
      timeLimit: 30,
      answers: [],
    };
    setRounds([...rounds, newRound]);
  };

  const handleUpdateRound = (index: number, field: string, value: any) => {
    const updatedRounds = [...rounds];
    (updatedRounds[index] as any)[field] = value;
    setRounds(updatedRounds);
  };

  const handleUpdateOption = (roundIndex: number, optionIndex: number, value: string) => {
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex].options[optionIndex] = value;
    setRounds(updatedRounds);
  };

  const handleDeleteRound = (index: number) => {
    const updatedRounds = rounds.filter((_, i) => i !== index);
    // Renuméroter les rounds
    updatedRounds.forEach((round, i) => {
      round.roundNumber = i;
    });
    setRounds(updatedRounds);
  };

  const handleSaveConfiguration = async () => {
    try {
      await updateSession(resolvedParams.sessionId, { rounds });
      alert('Configuration sauvegardée !');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Erreur lors de la sauvegarde : ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const handleStartGame = async () => {
    if (rounds.length === 0) {
      alert('Veuillez ajouter au moins un round avant de commencer');
      return;
    }

    if (!session?.players || session.players.length === 0) {
      alert('Attendez que des joueurs rejoignent la partie');
      return;
    }

    try {
      await updateSession(resolvedParams.sessionId, {
        rounds,
        status: 'playing',
        currentRound: 0,
      });
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Erreur lors du démarrage : ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const handleNextRound = async () => {
    if (!session) return;

    const nextRound = session.currentRound + 1;

    if (nextRound >= rounds.length) {
      // Partie terminée - sauvegarder les stats
      await saveGameStats();

      await updateSession(resolvedParams.sessionId, { status: 'finished' });
      return;
    }

    await updateSession(resolvedParams.sessionId, {
      status: 'playing',
      currentRound: nextRound,
    });
  };

  const saveGameStats = async () => {
    if (!session) return;

    try {
      const rankedPlayers = rankPlayers(session.players);
      const playersWithStats = rankedPlayers.map((player, index) => {
        // Compter les bonnes réponses du joueur
        let correctAnswers = 0;
        session.rounds.forEach(round => {
          const playerAnswer = round.answers.find(a => a.playerId === player.id);
          if (playerAnswer && playerAnswer.points > 0) {
            correctAnswers++;
          }
        });

        return {
          playerId: player.id,
          username: player.username,
          avatar: player.avatar,
          score: player.score,
          position: index + 1,
          correctAnswers,
        };
      });

      await saveStats(
        session.sessionId,
        playersWithStats,
        session.rounds.length
      );

      console.log('Stats saved successfully');
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  const handleShowScoreboard = async () => {
    await updateSession(resolvedParams.sessionId, { status: 'scoreboard' });
  };

  // Afficher le chargement pendant le fetch initial
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">💃</div>
          <p className="text-xl text-gray-600">Chargement de la session...</p>
        </div>
      </div>
    );
  }

  // Afficher une erreur si la session n'existe pas
  if (fetchError || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Session introuvable
          </h1>
          <p className="text-gray-600 mb-6">
            La session {resolvedParams.sessionId} n&apos;existe pas ou a expiré.
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  // Afficher une notification si SSE rencontre une erreur (non bloquant)
  const showSSEError = sessionError && !liveSession;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Notification d'erreur SSE (non bloquante) */}
        {showSSEError && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Connexion temps réel interrompue. Les mises à jour automatiques ne fonctionnent pas.
                  Rafraîchissez la page pour voir les derniers changements.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Administration
              </h1>
              <p className="text-gray-600">Session: {resolvedParams.sessionId}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                session.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                session.status === 'playing' ? 'bg-green-100 text-green-700' :
                session.status === 'scoreboard' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {session.status === 'waiting' ? 'En attente' :
                 session.status === 'playing' ? 'En cours' :
                 session.status === 'scoreboard' ? 'Scores' : 'Terminée'}
              </div>
            </div>
          </div>

          {/* Share link */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Lien de la partie :
            </p>
            <div className="flex space-x-2">
              <input
                type="text"
                value={sessionUrl}
                readOnly
                className="input-field flex-1 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="btn-secondary flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
          </div>
        </div>

        {session.status === 'waiting' && (
          <>
            {/* Players */}
            <PlayerQueue players={session.players} adminId={adminId} />

            {/* Configuration */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Settings className="w-6 h-6 text-purple-600 mr-2" />
                  Configuration des rounds
                </h2>
                <button
                  onClick={handleAddRound}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un round</span>
                </button>
              </div>

              <div className="space-y-6">
                {rounds.map((round, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        Round {index + 1}
                      </h3>
                      <button
                        onClick={() => handleDeleteRound(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          URL du média
                        </label>
                        <input
                          type="text"
                          value={round.mediaUrl}
                          onChange={(e) => handleUpdateRound(index, 'mediaUrl', e.target.value)}
                          placeholder="https://..."
                          className="input-field text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Type de média
                        </label>
                        <select
                          value={round.mediaType}
                          onChange={(e) => handleUpdateRound(index, 'mediaType', e.target.value as MediaType)}
                          className="input-field text-sm"
                        >
                          <option value="video">Vidéo</option>
                          <option value="image">Image</option>
                          <option value="audio">Audio</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          value={round.question}
                          onChange={(e) => handleUpdateRound(index, 'question', e.target.value)}
                          className="input-field text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Temps limite (secondes)
                        </label>
                        <input
                          type="number"
                          value={round.timeLimit}
                          onChange={(e) => handleUpdateRound(index, 'timeLimit', parseInt(e.target.value))}
                          min="5"
                          max="120"
                          className="input-field text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Réponses possibles (5 options)
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {round.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct-${index}`}
                              checked={round.correctAnswer === option}
                              onChange={() => handleUpdateRound(index, 'correctAnswer', option)}
                              className="w-4 h-4"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleUpdateOption(index, optIndex, e.target.value)}
                              className="input-field text-sm flex-1"
                              placeholder={`Option ${optIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Cochez la réponse correcte
                      </p>
                    </div>
                  </div>
                ))}

                {rounds.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Aucun round configuré. Ajoutez-en un pour commencer !
                  </p>
                )}
              </div>

              {rounds.length > 0 && (
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handleSaveConfiguration}
                    className="btn-secondary"
                  >
                    Sauvegarder la configuration
                  </button>
                  <button
                    onClick={handleStartGame}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Démarrer la partie</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {(session.status === 'playing' || session.status === 'scoreboard') && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Contrôles de la partie
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={handleShowScoreboard}
                className="btn-secondary flex items-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Afficher les scores</span>
              </button>
              <button
                onClick={handleNextRound}
                className="btn-primary flex items-center space-x-2"
              >
                <SkipForward className="w-5 h-5" />
                <span>
                  {session.currentRound + 1 >= rounds.length
                    ? 'Terminer la partie'
                    : 'Round suivant'}
                </span>
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Round actuel : {session.currentRound + 1} / {rounds.length}
            </div>
          </div>
        )}

        {session.status === 'finished' && (
          <div className="card text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Partie terminée !
            </h2>
            <button
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
