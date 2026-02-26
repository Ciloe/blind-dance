'use client';

import { Player } from '@/types';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface PodiumProps {
  players: Player[];
}

export default function Podium({ players }: PodiumProps) {
  const topThree = players.slice(0, 3);
  const rest = players.slice(3);

  // Réorganiser pour le podium visuel : 2e, 1er, 3e
  const podiumOrder = topThree.length >= 3
    ? [topThree[1], topThree[0], topThree[2]]
    : topThree.length === 2
    ? [topThree[1], topThree[0]]
    : topThree;

  const getHeight = (position: number) => {
    switch (position) {
      case 1: return 'h-64';
      case 2: return 'h-48';
      case 3: return 'h-40';
      default: return 'h-32';
    }
  };

  const getPosition = (index: number) => {
    if (podiumOrder.length === 3) {
      return index === 1 ? 1 : index === 0 ? 2 : 3;
    }
    return index + 1;
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-2">
          Félicitations !
        </h1>
        <p className="text-xl text-gray-600">Voici le classement final</p>
      </motion.div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-2 md:gap-4 px-2 md:px-4">
        {podiumOrder.map((player, index) => {
          const position = getPosition(index);
          const medals = ['🥇', '🥈', '🥉'];

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`flex flex-col items-center ${getHeight(position)}`}
            >
              {/* Player card */}
              <div className="mb-2 md:mb-4 text-center">
                <motion.div
                  animate={{
                    scale: position === 1 ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                  className="relative"
                >
                  <div className="text-4xl md:text-6xl mb-1 md:mb-2">{player.avatar.emoji}</div>
                  {position === 1 && (
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2">
                      <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-yellow-500" />
                    </div>
                  )}
                </motion.div>
                <p className="font-bold text-sm md:text-lg text-gray-800 truncate max-w-[80px] md:max-w-none">{player.username}</p>
                <p className="text-xl md:text-3xl font-bold text-purple-600">{player.score}</p>
              </div>

              {/* Podium block */}
              <div
                className={`w-20 md:w-32 ${getHeight(position)} rounded-t-xl md:rounded-t-2xl flex flex-col items-center justify-center transition-all ${
                  position === 1
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500'
                    : position === 2
                    ? 'bg-gradient-to-br from-gray-300 to-gray-400'
                    : 'bg-gradient-to-br from-orange-400 to-orange-500'
                }`}
              >
                <div className="text-3xl md:text-5xl mb-1 md:mb-2">{medals[position - 1]}</div>
                <div className="text-white text-xl md:text-2xl font-bold">{position}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rest of players */}
      {rest.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Autres participants
          </h3>
          <div className="space-y-2">
            {rest.map((player, index) => (
              <div
                key={player.id}
                className="card flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-gray-400 w-8">
                    #{index + 4}
                  </div>
                  <div className="text-3xl">{player.avatar.emoji}</div>
                  <div>
                    <p className="font-semibold text-gray-800">{player.username}</p>
                    <p className="text-sm text-gray-500">{player.avatar.name}</p>
                  </div>
                </div>
                <div className="text-xl font-bold text-purple-600">
                  {player.score}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
