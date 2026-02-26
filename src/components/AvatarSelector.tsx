'use client';

import { Avatar, AVATARS } from '@/types';

interface AvatarSelectorProps {
  selectedAvatar: Avatar;
  onSelectAvatar: (avatar: Avatar) => void;
}

export default function AvatarSelector({
  selectedAvatar,
  onSelectAvatar,
}: AvatarSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold text-gray-700">
        Choisissez votre avatar
      </label>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => onSelectAvatar(avatar)}
            className={`avatar-option ${
              selectedAvatar.id === avatar.id ? 'selected' : ''
            }`}
            title={avatar.name}
          >
            {avatar.emoji}
          </button>
        ))}
      </div>
      {selectedAvatar && (
        <p className="text-center text-sm text-gray-600">
          Sélectionné : {selectedAvatar.emoji} {selectedAvatar.name}
        </p>
      )}
    </div>
  );
}
