import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const { login, password } = await request.json();

  const adminDataPath = path.join(process.cwd(), '/app/data', 'admin.json');
  const adminData = JSON.parse(fs.readFileSync(adminDataPath, 'utf-8'));

  if (login === adminData.login && password === adminData.password) {
    
    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
    response.cookies.set('admin-auth-token', 'valid-token', { httpOnly: false });
    return response;
  } else {
    return NextResponse.json({ error: 'Invalid login or password' }, { status: 401 });
  }
}

