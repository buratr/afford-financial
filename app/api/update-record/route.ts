import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function PUT(request: NextRequest) {
  try {
    const { id, name, lastName, SS, dateOfBirth, income } = await request.json();
    
    const currentDate = new Date();
    const aplicantDate = currentDate.toISOString().split('T')[0];
    const loanAmount = Math.round(((income/100)*10)  / 1000) * 1000 
    let expiration
    currentDate.setFullYear(currentDate.getFullYear() +1);
    expiration = currentDate.toISOString().split('T')[0];

    // Обновляем запись в таблице по ID
    const result = await sql`
      UPDATE records 
      SET aplicant_date = ${aplicantDate}, name = ${name}, last_name = ${lastName}, ss = ${SS}, date_of_birth = ${dateOfBirth}, income = ${income}, loan_amount = ${loanAmount}, status = 'Awaiting signature', expiration = ${expiration}
      WHERE aplicant_id = ${id} ;
    `;

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
