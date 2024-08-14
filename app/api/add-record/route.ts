import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';



export async function POST(request: NextRequest) {
  try {
    const { aplicantId, aplicantPhone } = await request.json();
    console.log("in POST")
    // Путь к JSON-файлу
    const filePath = path.join(process.cwd(), 'app', '/data', 'bd.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileData);
    console.log("read file", data)

    // Добавление новой записи
    //const newRecord = { aplicantName, aplicantDate, loanAmount, status, expiration };
    const newRecord = { aplicantPhone, id:aplicantId };
    data.push(newRecord);
    console.log("newRecord", data)
    // Запись обновленных данных обратно в файл
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log("Record to file")
    return NextResponse.json({ message: 'Record added successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add record' }, { status: 500 });
  }
}
