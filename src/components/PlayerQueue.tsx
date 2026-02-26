'use client';

import { Player } from '@/types';
import { Crown } from 'lucide-react';

interface PlayerQueueProps {
  players: Player[];
  adminId: string;
}

export default function PlayerQueue({ players, adminId }: PlayerQueueProps) {
  return (
    <div className="card">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">👥</span>
        Joueurs en attente ({players.length})
      </h2>
      <div className="space-y-2">
        {players.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            En attente de joueurs...
          </p>
        ) : (
          players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-3 md:p-4 rounded-lg border-2 border-purple-100"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="text-2xl md:text-3xl flex-shrink-0">{player.avatar.emoji}</div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm md:text-base text-gray-800 flex items-center truncate">
                    <span className="truncate">{player.username}</span>
                    {player.id === adminId && (
                      <Crown className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 ml-1 md:ml-2 flex-shrink-0" />
                    )}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 truncate">{player.avatar.name}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs md:text-sm text-gray-500">Prêt</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
