import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const {applicantId, applicantDate, applicantPhone, name, lastName, studentName, SS, dateOfBirth, income, loanAmount, status, expiration } = await request.json();
  
    // Вставляем новую запись в таблицу
    const result = await sql`
      INSERT INTO records (applicant_id, applicant_date, applicant_phone, name, last_name, student_name, ss, date_of_birth, income, loan_amount, status, expiration)
      VALUES (${applicantId}, ${applicantDate}, ${applicantPhone}, ${name}, ${lastName}, ${studentName}, ${SS}, ${dateOfBirth}, ${income}, ${loanAmount}, ${status}, ${expiration});
    `;

    return NextResponse.json({ message: 'Record added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding record:', error);
    return NextResponse.json({ error: 'Failed to add record' }, { status: 500 });
  }
}






// import { NextRequest, NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function POST(request: NextRequest) {
//   try {
//     const { aplicantId, aplicantPhone } = await request.json();
//     console.log("in POST")
//     // Путь к JSON-файлу
//     const filePath = path.join(process.cwd(), 'app', 'data', 'bd.json');
//     const fileData = fs.readFileSync(filePath, 'utf-8');
//     const data = JSON.parse(fileData);
//     console.log("read file", data)

//     // Добавление новой записи
//     //const newRecord = { aplicantName, aplicantDate, loanAmount, status, expiration };
//     const newRecord = { aplicantPhone, id:aplicantId };
//     data.push(newRecord);
//     console.log("newRecord", data)
//     // Запись обновленных данных обратно в файл
//     fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
//     console.log("Record to file")
//     return NextResponse.json({ message: 'Record added successfully' }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to add record' }, { status: 500 });
//   }
// }
