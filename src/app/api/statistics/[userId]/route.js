import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export const dynamic = 'force-dynamic'

export async function GET(request, context) {

    let session;

    try {
        session = await getServerSession(authOptions);
        console.log(session);
        if (!session) {
            return NextResponse.json({ message: 'Debe iniciar sesión para utilizar este servicio' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error en la sesión, debe iniciar sesión para utilizar este servicio' }, { status: 500 });
    }

    if (session.user.email == ('adan10104334@gmail.com' || 'adricoque.coqa@gmail.com')) {
        const uri = process.env.MONGO_URL; // Reemplaza <username> y <password> con tus credenciales
        const client = new MongoClient(uri);
        const { params } = context;
        const userId = params.userId;

        try {
            await client.connect();

            const collection = client.db("ByOx").collection("statistics");
            const userStats = await collection.find({ 'user': userId }).toArray();
            return NextResponse.json(userStats);

        } catch (error) {
            console.error("Error: ", error);
            return NextResponse.json({ error: 'Error connecting to database' });
        } finally {
            await client.close();
        }
    } else {
        return NextResponse.json({ error: 'No eres miembro de los usuarios administradores'})
    }
}