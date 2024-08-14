import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    
    const filePath = path.join(process.cwd(), 'app', '/data', 'bd.json');
    console.log("fileData_0",filePath) 
    const fileData = fs.readFileSync(filePath, 'utf-8');
    console.log("fileData:", fileData)
    const data = JSON.parse(fileData);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}
