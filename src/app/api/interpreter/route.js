import { Rettiwt } from 'rettiwt-api';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/route";

export const dynamic = 'force-dynamic'

export async function POST(req, res) {

    let session;
    try {
        session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ message: 'Debe iniciar sesión para utilizar este servicio'}, {status: 401});
        }
    } catch (error){
        return NextResponse.json({ message: 'Error en la sesión, debe iniciar sesión para utilizar este servicio'}, {status: 500});
    }
    
    const API_KEY = process.env.OPENAI_KEY;
    const body = await req.json();

    try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        const message = data.choices[0].message.content;
        return NextResponse.json( message );
  } catch (error){
        console.error('Error al procesar la solicitud de tweets:', error, req.json().emotion);
        return NextResponse.error({ message: 'Error interno del servidor' });
  }
}
