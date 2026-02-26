import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

// Route de debug pour tester Vercel Blob
export async function GET() {
  try {
    // Tester la connexion Vercel Blob
    const { blobs } = await list({ limit: 100 });

    return NextResponse.json({
      status: 'ok',
      message: 'Vercel Blob is working',
      token: process.env.BLOB_READ_WRITE_TOKEN ? 'configured' : 'missing',
      totalBlobs: blobs.length,
      blobs: blobs.map(b => ({
        pathname: b.pathname,
        size: b.size,
        uploadedAt: b.uploadedAt,
      })),
    });
  } catch (error) {
    console.error('Blob test error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        token: process.env.BLOB_READ_WRITE_TOKEN ? 'configured' : 'missing',
      },
      { status: 500 }
    );
  }
}
