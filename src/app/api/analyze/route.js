import { NextResponse } from 'next/server';

export async function POST(req) {
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

