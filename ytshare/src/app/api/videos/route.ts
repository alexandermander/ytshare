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
  const { index } = (await req.json()) as { index: number };
  if (typeof index === "number" && index >= 0 && index < videos.length) {
    videos.splice(index, 1);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 400 });
}
