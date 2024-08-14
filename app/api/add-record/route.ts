import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';



export async function POST(request: NextRequest) {
  try {
    const { aplicantId, aplicantPhone } = await request.json();

    // Путь к JSON-файлу
    const filePath = path.join(process.cwd(), 'app', '/data', 'bd.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileData);
  

    // Добавление новой записи
    //const newRecord = { aplicantName, aplicantDate, loanAmount, status, expiration };
    const newRecord = { aplicantPhone, id:aplicantId };
    data.push(newRecord);

    // Запись обновленных данных обратно в файл
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Record added successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add record' }, { status: 500 });
  }
}
