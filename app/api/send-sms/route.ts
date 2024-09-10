// app/api/send-sms/route.ts
import { NextResponse, NextRequest } from 'next/server';
import twilio from 'twilio';


export async function POST(request: NextRequest) {

  let {id, currentUrl, phoneNumber} = await request.json();
   const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
   const authToken = process.env.TWILIO_AUTH_TOKEN as string;
   const client = twilio(accountSid, authToken);
   //console.log(id," ", currentUrl)
   
  try {
    const message = await client.messages.create({
      body: `StudyPoint Boston invites you to apply for educational financing through Afford Financial. Use this secure link to apply: ${currentUrl}add?id=${id} `,
      from: '+18449191857',
      to: '+18777804236',
    });

     return NextResponse.json({ body: message.body });
  } catch (error) {
    return NextResponse.error();
  }
}
