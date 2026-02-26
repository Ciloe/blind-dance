'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Users, Sparkles, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/session/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/admin/${data.sessionId}`);
      }
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Erreur lors de la création de la session');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinSession = () => {
    if (sessionId.trim()) {
      router.push(`/play/${sessionId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12 float-animation">
          <div className="flex justify-center mb-6">
            <div className="text-8xl">💃</div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Blind Dance
          </h1>
          <p className="text-xl text-gray-600">
            Devinez le type de danse et prouvez vos connaissances musicales !
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          {/* Créer une session */}
          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Créer une partie
                </h2>
                <p className="text-gray-600 mb-4">
                  Créez une nouvelle session, configurez les rounds et invitez vos amis !
                </p>
                <button
                  onClick={handleCreateSession}
                  disabled={isCreating}
                  className="btn-primary"
                >
                  {isCreating ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Création...
                    </span>
                  ) : (
                    'Créer une session'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Rejoindre une session */}
          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Rejoindre une partie
                </h2>
                <p className="text-gray-600 mb-4">
                  Vous avez un code de session ? Rejoignez vos amis !
                </p>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Code de session"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && handleJoinSession()}
                    className="input-field flex-1"
                    maxLength={10}
                  />
                  <button
                    onClick={handleJoinSession}
                    disabled={!sessionId.trim()}
                    className="btn-secondary"
                  >
                    Rejoindre
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comment jouer */}
          <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Comment jouer ?
                </h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">🎯</span>
                    <span>Regardez/écoutez le média présenté</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">⚡</span>
                    <span>Choisissez rapidement parmi les 5 types de danse proposés</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🏆</span>
                    <span>Gagnez 100 points + bonus de rapidité pour chaque bonne réponse</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🥇</span>
                    <span>Le joueur avec le plus de points remporte la partie !</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/stats')}
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Voir les statistiques et le classement</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Créé avec 💜 pour les amateurs de danse</p>
        </div>
      </div>
    </div>
  );
}
