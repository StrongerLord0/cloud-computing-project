import { Rettiwt } from 'rettiwt-api';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/route";

export const dynamic = 'force-dynamic'

export async function POST(req, res) {
    /*
    let session;
    try {
        session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ message: 'Debe iniciar sesión para utilizar este servicio'}, {status: 401});
        }
    } catch (error){
        return NextResponse.json({ message: 'Error en la sesión, debe iniciar sesión para utilizar este servicio'}, {status: 500});
    }
    */
    
    const API_KEY = process.env.TWEET_API_KEY
    const body = await req.json();
    const hashtags = body.hashtags;
    try {
        const rettiwt = new Rettiwt({ apiKey: API_KEY})
        await rettiwt.tweet.search({
            hashtags: hashtags
        })
        .then(data => {
            res = data;
        })
        .catch(err => {
            res = 'Error al buscar tweets:',err;
        });

        return NextResponse.json(res);
  } catch (error){
        console.error('Error al procesar la solicitud de tweets:', error, req.json().emotion);
        return NextResponse.error({ message: 'Error interno del servidor' });
  }
}
