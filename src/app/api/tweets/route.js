import { Rettiwt } from 'rettiwt-api';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function POST(req, res) {
    const API_KEY = process.env.TWEET_API_KEY
    const { emotion } = await req.json();
    
    try {
        const rettiwt = new Rettiwt({ apiKey: API_KEY})
        await rettiwt.tweet.search({
            hashtags: [emotion]
        })
        .then(data => {
            res = data
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
