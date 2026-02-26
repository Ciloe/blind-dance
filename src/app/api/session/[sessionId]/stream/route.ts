import { NextRequest } from 'next/server';
import { getSession } from '@/lib/blob';

// Server-Sent Events pour le temps réel
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let lastUpdate = new Date();
      let isClosed = false;

      // Fonction pour envoyer les données
      const sendUpdate = async () => {
        if (isClosed) return;

        try {
          const session = await getSession(sessionId);

          if (session && session.updatedAt > lastUpdate) {
            lastUpdate = session.updatedAt;
            const data = `data: ${JSON.stringify(session)}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
        } catch (error) {
          console.error('Error in SSE:', error);
        }
      };

      // Envoyer immédiatement
      await sendUpdate();

      // Puis toutes les secondes
      const interval = setInterval(sendUpdate, 1000);

      // Cleanup
      request.signal.addEventListener('abort', () => {
        isClosed = true;
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
