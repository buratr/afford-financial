import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' }, { status: 200 });
  response.cookies.set('admin-auth-token', '', { maxAge: -1 }); // Удаление кука
  return response;
}
