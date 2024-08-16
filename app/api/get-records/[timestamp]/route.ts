import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest, { params }: { params: { timestamp: string } }) {
  try {
    const timestamp = params.timestamp
    // Получаем все записи из таблицы records
  //   await sql`
  //   INSERT INTO records (aplicant_phone, name, last_name, ss, date_of_birth, income, loan_amount, status, expiration)
  //   VALUES ('test-phone', 'John', 'Doe', '1234', '1990-01-01', '50000', 3000, 'Pending', '2025-01-01')
  // `;
  // WHERE id > 0;
  let data;
   const { rows } = await sql`SELECT * FROM records WHERE aplicant_id = ${timestamp};`;
   const  rows2 = await sql`SELECT * FROM records ORDER BY id DESC;`;
   if(rows.length !== 0){
    data=rows
   }else{
    data=rows2.rows
   }
  console.log(data)
     //const { rows } = await sql`SELECT * FROM records WHERE aplicant_phone = '+38093252454'`
    //return NextResponse.json({ records: rows }, { status: 200 });

    return NextResponse.json({data:data , time:timestamp}, { status: 200 });
  } catch (error) {
    console.error('Error retrieving records:', error);
    return NextResponse.json({ error: 'Failed to retrieve records' }, { status: 500 });
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
