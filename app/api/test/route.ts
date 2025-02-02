import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'Backend is running!' });
}