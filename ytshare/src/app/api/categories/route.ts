import { NextRequest, NextResponse } from 'next/server';
import { categories, Category } from '../store';

export async function GET() {
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const data = (await req.json()) as Category[];
  categories.splice(0, categories.length, ...data);
  return NextResponse.json({ ok: true });
}
