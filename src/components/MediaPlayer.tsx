'use client';

import { MediaType } from '@/types';
import { Music, Video, Image as ImageIcon } from 'lucide-react';

interface MediaPlayerProps {
  mediaUrl: string;
  mediaType: MediaType;
}

export default function MediaPlayer({ mediaUrl, mediaType }: MediaPlayerProps) {
  return (
    <div className="card">
      <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden flex items-center justify-center">
        {mediaType === 'video' && (
          <video
            src={mediaUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          >
            Votre navigateur ne supporte pas la vidéo.
          </video>
        )}

        {mediaType === 'image' && (
          <img
            src={mediaUrl}
            alt="Danse"
            className="w-full h-full object-contain"
          />
        )}

        {mediaType === 'audio' && (
          <div className="text-center p-8">
            <div className="text-6xl mb-4 animate-bounce">🎵</div>
            <audio
              src={mediaUrl}
              controls
              autoPlay
              className="w-full max-w-md"
            >
              Votre navigateur ne supporte pas l'audio.
            </audio>
            <p className="mt-4 text-gray-600">Écoutez attentivement...</p>
          </div>
        )}

        {!mediaUrl && (
          <div className="text-center text-gray-400">
            <Music className="w-16 h-16 mx-auto mb-2" />
            <p>Média non disponible</p>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center space-x-2 text-sm text-gray-500">
        {mediaType === 'video' && <Video className="w-4 h-4" />}
        {mediaType === 'audio' && <Music className="w-4 h-4" />}
        {mediaType === 'image' && <ImageIcon className="w-4 h-4" />}
        <span className="capitalize">{mediaType}</span>
      </div>
    </div>
  );
}
