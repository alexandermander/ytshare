import { NextRequest, NextResponse } from 'next/server';
import { videos, Video } from '../store';

export async function GET() {
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const data = (await req.json()) as Video;
  videos.push(data);
  return NextResponse.json({ ok: true });
}
