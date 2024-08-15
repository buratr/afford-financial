import { NextRequest, NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

const BLOB_NAME = 'https://r2hzvabitgjqcbrp.public.blob.vercel-storage.com/bd.json';

export async function POST(request: NextRequest) {
  try {
     const { id, name, lastName, SS, dateOfBirth, income } = await request.json();

    // // Получаем URL файла
     const { blobs } = await list({ prefix: BLOB_NAME });
     const fileUrl = blobs[0]?.url;

    if (!fileUrl) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Получаем текущие данные из Blob
    const response = await fetch(fileUrl);
    const text = await response.text();
    const data = JSON.parse(text);

    const currentDate = new Date();
    const aplicantDate = currentDate.toISOString().split('T')[0];
    const loanAmount = Math.round(((income/100)*10) / 1000) * 1000;
    
    let expiration;
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    expiration = currentDate.toISOString().split('T')[0];

    // Поиск записи по id
    const recordIndex = data.findIndex((record: any) => record.id === id);

    if (recordIndex === -1) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Обновление записи
    data[recordIndex] = {
      ...data[recordIndex],
      name,
      lastName,
      SS,
      dateOfBirth,
      income,
      aplicantDate,
      loanAmount,
      status: "Awaiting signature",
      expiration,
    };

    console.log(data);

    //Запись обновленных данных обратно в Blob
    await put(BLOB_NAME, JSON.stringify(data, null, 2), {
      access: 'public',
      contentType: 'application/json',
    });

    return NextResponse.json({ message: 'Record updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating record:', error);
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function POST(request: NextRequest) {
//   try {
//      const { id, name, lastName, SS, dateOfBirth, income } = await request.json();

//     // // Путь к JSON-файлу
//     const filePath = path.join(process.cwd(), 'app', 'data', 'bd.json');
//     const fileData = fs.readFileSync(filePath, 'utf-8');
//     const data = JSON.parse(fileData);
//     const currentDate = new Date();
//     const aplicantDate = currentDate.toISOString().split('T')[0];
//     const loanAmount = Math.round(((income/100)*10)  / 1000) * 1000 
    
    
//     let expiration
//     currentDate.setFullYear(currentDate.getFullYear() +1);
//     expiration = currentDate.toISOString().split('T')[0];
//     // Поиск записи по id
//     const recordIndex = data.findIndex((record: any) => record.id === id);

//     if (recordIndex === -1) {
//       return NextResponse.json({ error: 'Record not found' }, { status: 404 });
//     }

//     // Обновление записи
//     data[recordIndex] = {
//       ...data[recordIndex],
//       name,
//       lastName,
//       SS,
//       dateOfBirth,
//       income,
//       aplicantDate,
//       loanAmount,
//       status:"Awaiting signature",
//       expiration,
//     };

//     console.log(data)
//     // // Запись обновленных данных обратно в файл
//      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

//     return NextResponse.json({ message: 'Record updated successfully' }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
//   }
// }
