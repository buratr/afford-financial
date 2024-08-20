import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function PUT(request: NextRequest) {
  try {
    const { id, name, lastName, studentName, SS, dateOfBirth, income, loanAmount, expiration, status, period, percent } = await request.json();
    
    const currentDate = new Date();
    const applicantDate = currentDate.toISOString().split('T')[0];
   // const loanAmount = 10000 //Math.round(((income/100)*10)  / 1000) * 1000 
    // let expiration
    // currentDate.setFullYear(currentDate.getFullYear() +1);
    // expiration = currentDate.toISOString().split('T')[0];

    // Обновляем запись в таблице по ID
    let query:string = "UPDATE records SET"

    if(period){
      query += ` period = ${period}`
    }
    if(percent){
      query += `, percent = ${percent}`
    }
    if(name){
      query += ` name = '${name}'`
    }
    if(lastName){
      query += `, last_name = '${lastName}'`
    }
    if(studentName){
      query += `, student_name = '${studentName}'`
    }
    if(SS){
      query += `, ss = '${SS}'`
    }
    if(dateOfBirth){
      query += `, date_of_birth = '${dateOfBirth}'`
    }
    if(income){
      query += `, income = ${income}`
    }
    if(loanAmount){
      query += `, loan_amount = ${loanAmount}`
    }
    if(expiration){
      query += `, expiration = '${expiration}'`
    }
    if(status){
      query += `, status = '${status}'`
    }

     query += ` WHERE applicant_id = '${id}'`
     //console.log("query: ", query)
    // const result = await sql`
    //   UPDATE records 
    //   SET applicant_date = ${applicantDate}, name = ${name}, last_name = ${lastName}, student_name = ${studentName}, ss = ${SS}, date_of_birth = ${dateOfBirth}, income = ${income}, loan_amount = ${loanAmount}, status = 'Awaiting signature', expiration = ${expiration}
    //   WHERE applicant_id = ${id} ;
    // `;
    const result = await sql.query(query);
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
