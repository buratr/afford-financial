import { NextResponse } from 'next/server';

const BLOB_URL = 'https://r2hzvabitgjqcbrp.public.blob.vercel-storage.com/bd.json';

export async function GET() {
  try {
    // Получаем содержимое файла по URL
    const response = await fetch(BLOB_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Парсим JSON
    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching records:', error);
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}

// import fs from 'fs';
// import path from 'path';

// export async function GET() {
//   try {
    
//     const filePath = path.join(process.cwd(), 'app', '/data', 'bd.json');
//     //console.log("fileData_0",filePath) 
//     const fileData = fs.readFileSync(filePath, 'utf-8');
//     //console.log("fileData:", fileData)
//     const data = JSON.parse(fileData);

//     return NextResponse.json(data, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
//   }
// }
