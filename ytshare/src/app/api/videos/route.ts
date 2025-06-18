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

export async function DELETE(req: NextRequest) {
  const { link } = (await req.json()) as { link: string };
  const idx = videos.findIndex((v) => v.link === link);
  if (idx !== -1) {
    videos.splice(idx, 1);
  }
  return NextResponse.json({ ok: true });
}
