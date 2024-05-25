import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req) {

  let session;

    try {
        session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({ message: 'Debe iniciar sesión para utilizar este servicio'}, {status: 401});
        }
    } catch (error){
        return NextResponse.json({ message: 'Error en la sesión, debe iniciar sesión para utilizar este servicio'}, {status: 500});
    }

    try {
      const formData = await req.formData();
      const file = formData.get('file');
      console.log(file)
      // Aquí puedes enviar el archivo utilizando fetch o cualquier otra biblioteca que desees

      const response = await fetch(process.env.IA_URL, {
        method: 'POST',
        body: formData, // Enviar el archivo como formData entrante
      });
  
      // Procesar la respuesta del servicio de reconocimiento facial
      const data = await response.json();
  
      // Devolver una respuesta al cliente
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      return NextResponse.error({ message: 'Error interno del servidor' });
    }
  }

