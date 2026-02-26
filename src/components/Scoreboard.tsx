'use client';

import { ScoreEntry } from '@/types';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScoreboardProps {
  scores: ScoreEntry[];
  showRoundPoints?: boolean;
}

export default function Scoreboard({ scores, showRoundPoints = false }: ScoreboardProps) {
  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${position}`;
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
          Classement
        </h2>
      </div>

      <div className="space-y-2">
        {scores.map((score, index) => (
          <motion.div
            key={score.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-lg ${
              index < 3
                ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300'
                : 'bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="text-2xl font-bold w-12 text-center">
                {getMedalEmoji(score.position)}
              </div>
              <div className="text-3xl">{score.avatar.emoji}</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{score.username}</p>
                <p className="text-sm text-gray-500">{score.avatar.name}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-2">
                {showRoundPoints && score.roundPoints !== undefined && (
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded ${
                      score.roundPoints > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {score.roundPoints > 0 ? '+' : ''}
                    {score.roundPoints}
                  </span>
                )}
                <div className="text-2xl font-bold text-purple-600">
                  {score.score}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
