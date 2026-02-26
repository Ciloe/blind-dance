import { useState, useEffect, useCallback } from 'react';
import { Session } from '@/types';

export function useSession(sessionId: string, enabled: boolean = true) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !sessionId) return;

    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout;
    let retryCount = 0;
    const maxRetries = 5;

    const connect = () => {
      try {
        // Utiliser Server-Sent Events pour le temps réel
        eventSource = new EventSource(`/api/session/${sessionId}/stream`);

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setSession(data);
            setIsLoading(false);
            setError(null);
            retryCount = 0; // Reset retry count on success
          } catch (err) {
            console.error('Error parsing SSE data:', err);
          }
        };

        eventSource.onerror = () => {
          console.error('SSE connection error');
          eventSource?.close();

          // Retry avec backoff exponentiel
          if (retryCount < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            retryTimeout = setTimeout(() => {
              retryCount++;
              connect();
            }, delay);
          } else {
            setError('Connexion perdue. Veuillez rafraîchir la page.');
          }
        };

        eventSource.onopen = () => {
          console.log('SSE connection opened');
          setError(null);
        };
      } catch (err) {
        console.error('Error creating EventSource:', err);
        setError('Erreur de connexion');
        setIsLoading(false);
      }
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [sessionId, enabled]);

  const refetch = useCallback(async () => {
    try {
      const response = await fetch(`/api/session/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSession(data);
      }
    } catch (err) {
      console.error('Error refetching session:', err);
    }
  }, [sessionId]);

  return { session, isLoading, error, refetch };
}
