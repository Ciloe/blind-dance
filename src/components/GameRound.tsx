'use client';

import { useState, useEffect } from 'react';
import { Round } from '@/types';
import { Clock, CheckCircle } from 'lucide-react';
import MediaPlayer from './MediaPlayer';
import { submitAnswer } from '@/actions/session';

interface GameRoundProps {
  round: Round;
  roundNumber: number;
  sessionId: string;
  playerId: string;
}

export default function GameRound({
  round,
  roundNumber,
  sessionId,
  playerId,
}: GameRoundProps) {
  const [timeRemaining, setTimeRemaining] = useState(round.timeLimit);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [result, setResult] = useState<{ points: number; isCorrect: boolean } | null>(null);

  // Timer
  useEffect(() => {
    if (hasAnswered) return;

    const handleTimeout = async () => {
      if (!hasAnswered && !selectedAnswer) {
        // Soumettre une réponse vide
        setHasAnswered(true);
        // Vous pouvez soumettre une réponse "vide" qui comptera 0 points
      }
    };

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasAnswered, selectedAnswer]);

  const handleSelectAnswer = async (answer: string) => {
    if (hasAnswered) return;

    setSelectedAnswer(answer);
    setHasAnswered(true);

    try {
      const result = await submitAnswer(
        sessionId,
        playerId,
        roundNumber,
        answer,
        timeRemaining
      );

      if (result.success && result.data) {
        setResult({ points: result.data.points, isCorrect: result.data.isCorrect });
      } else {
        console.error('Error submitting answer:', result.error);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const progressPercentage = (timeRemaining / round.timeLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Round {roundNumber + 1}
          </h2>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            <span
              className={`text-xl md:text-2xl font-bold ${
                timeRemaining <= 5 ? 'text-red-600 animate-pulse' : 'text-purple-600'
              }`}
            >
              {timeRemaining}s
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 md:mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              timeRemaining <= 5 ? 'bg-red-500' : 'bg-purple-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Media */}
      <MediaPlayer mediaUrl={round.mediaUrl} mediaType={round.mediaType} />

      {/* Question */}
      <div className="card">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 text-center">
          {round.question || 'Quel est ce type de danse ?'}
        </h3>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2 md:gap-3">
          {round.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(option)}
              disabled={hasAnswered}
              className={`p-3 md:p-4 rounded-lg font-semibold text-base md:text-lg transition-all transform ${
                hasAnswered
                  ? selectedAnswer === option
                    ? result?.isCorrect
                      ? 'bg-green-100 border-4 border-green-500 text-green-700'
                      : 'bg-red-100 border-4 border-red-500 text-red-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 active:scale-95 md:hover:scale-105 text-gray-800'
              }`}
            >
              {option}
              {hasAnswered && selectedAnswer === option && (
                <span className="ml-2">
                  {result?.isCorrect ? '✅' : '❌'}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Result */}
        {hasAnswered && result && (
          <div className="mt-4 md:mt-6 text-center">
            <div
              className={`inline-flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 rounded-full ${
                result.isCorrect
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-bold text-base md:text-xl">
                {result.isCorrect
                  ? `Bravo ! +${result.points} points`
                  : `Dommage ! 0 point`}
              </span>
            </div>
          </div>
        )}

        {hasAnswered && !result && (
          <div className="mt-4 md:mt-6 text-center">
            <div className="inline-flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 rounded-full bg-gray-100 text-gray-600">
              <span className="font-semibold text-sm md:text-base">En attente des autres joueurs...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
