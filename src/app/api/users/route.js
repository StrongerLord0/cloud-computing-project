import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET () {
    const uri = process.env.MONGO_URL; // Reemplaza <username> y <password> con tus credenciales
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const collection = client.db("ByOx").collection("users");
        const users = await collection.find({}).toArray();

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({ error: 'Error connecting to database' });
    } finally {
        await client.close();
    }
}