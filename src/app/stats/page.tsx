'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlayerStats } from '@/types/stats';
import { Trophy, TrendingUp, Target, Award, Calendar, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
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
  winRate: number;
}

function StatsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get('username');

  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'personal' | 'leaderboard'>(
    username ? 'personal' : 'leaderboard'
  );
  const [searchUsername, setSearchUsername] = useState(username || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
    if (username) {
      fetchPlayerStats(username);
    }
  }, [username]);

  const fetchPlayerStats = async (user: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/stats/player?username=${encodeURIComponent(user)}`);
      if (response.ok) {
        const data = await response.json();
        setPlayerStats(data);
      }
    } catch (error) {
      console.error('Error fetching player stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/stats/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const handleSearch = () => {
    if (searchUsername.trim()) {
      router.push(`/stats?username=${encodeURIComponent(searchUsername.trim())}`);
      fetchPlayerStats(searchUsername.trim());
      setActiveTab('personal');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4 font-semibold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à l&apos;accueil
          </button>

          <div className="text-center">
            <div className="text-5xl md:text-6xl mb-4">📊</div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Statistiques
            </h1>
            <p className="text-base md:text-xl text-gray-600">
              Consultez vos performances et le classement général
            </p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Rechercher un joueur..."
              className="input-field flex-1"
            />
            <button onClick={handleSearch} className="btn-primary whitespace-nowrap">
              Rechercher
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 md:px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'personal'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Mes Statistiques
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 md:px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Classement Général
          </button>
        </div>

        {/* Personal Stats */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="card text-center py-12">
                <div className="text-4xl mb-4 animate-bounce">⏳</div>
                <p className="text-gray-600">Chargement...</p>
              </div>
            ) : playerStats && playerStats.totalGames > 0 ? (
              <>
                {/* Player Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                >
                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="text-6xl md:text-7xl">{playerStats.avatar.emoji}</div>
                    <div className="text-center sm:text-left flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">{playerStats.username}</h2>
                      <p className="text-purple-100">{playerStats.avatar.name}</p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                        <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                          {playerStats.totalGames} parties jouées
                        </div>
                        <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                          {playerStats.totalWins} victoires
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl md:text-3xl font-bold text-gray-800">
                          {playerStats.totalPoints}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">Points totaux</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl md:text-3xl font-bold text-gray-800">
                          {playerStats.averagePoints}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">Moyenne/partie</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl md:text-3xl font-bold text-gray-800">
                          {playerStats.accuracyPercentage}%
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">Précision</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-2xl md:text-3xl font-bold text-gray-800">
                          {playerStats.bestScore}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">Meilleur score</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Game History */}
                <div className="card">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mr-2" />
                    Historique des parties
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {playerStats.games.map((game, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-3 md:p-4 rounded-lg border-2 border-gray-200 gap-2"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-xl md:text-2xl">
                            {game.position === 1 ? '🥇' : game.position === 2 ? '🥈' : game.position === 3 ? '🥉' : `#${game.position}`}
                          </div>
                          <div>
                            <p className="font-semibold text-sm md:text-base text-gray-800">
                              {game.score} points
                            </p>
                            <p className="text-xs md:text-sm text-gray-500">
                              {formatDate(game.date)} • {game.players} joueurs
                            </p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs md:text-sm text-gray-600">
                            {game.correctAnswers}/{game.totalRounds} bonnes réponses
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="card text-center py-12">
                <div className="text-5xl md:text-6xl mb-4">🎮</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  Aucune statistique
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchUsername
                    ? `Aucune partie trouvée pour "${searchUsername}"`
                    : 'Recherchez un joueur pour voir ses statistiques'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="card">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 mr-2" />
              Top 100 Joueurs
            </h3>
            {leaderboard.length > 0 ? (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.username}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`flex items-center justify-between p-3 md:p-4 rounded-lg ${
                      index < 3
                        ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300'
                        : 'bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                      <div className="text-lg md:text-2xl font-bold w-8 md:w-12 text-center flex-shrink-0">
                        {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                      </div>
                      <div className="text-2xl md:text-3xl flex-shrink-0">{entry.avatar.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm md:text-base text-gray-800 truncate">
                          {entry.username}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                          {entry.totalGames} parties • {entry.winRate}% victoires
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg md:text-2xl font-bold text-purple-600">
                        {entry.totalPoints}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        ~{entry.averagePoints}/partie
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl md:text-6xl mb-4">📊</div>
                <p className="text-gray-600">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StatsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📊</div>
          <p className="text-xl text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <StatsPageContent />
    </Suspense>
  );
}
