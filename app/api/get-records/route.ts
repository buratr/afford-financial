import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const {search, sort, id, status} = await request.json();

    let query:string = "SELECT * FROM records"

    if(search){
      const querySearch = `%${search}%`;
      query += ` WHERE 
          ( name ILIKE '${querySearch}' OR
          last_name ILIKE '${querySearch}' OR
          student_name ILIKE '${querySearch}' OR
          applicant_phone ILIKE '${querySearch}' OR
          loan_amount::TEXT ILIKE '${querySearch}')
      `
      if(status){
        query += ` AND status = '${status}'`
      }
      //console.log("search: ", search)
    }else if(status){
      query += ` WHERE status = '${status}'`
    }


    if(sort){
      query += " ORDER BY " + sort.field + " " + sort.order
    }

    if(id){
      query += ` WHERE applicant_id = '${id}';`
    }

    
    console.log("query: ", query)
    const { rows } = await sql.query(query);

    return NextResponse.json({data:rows}, { status: 200 });
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
