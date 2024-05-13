import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET (request, context) {
    const uri = process.env.MONGO_URL; // Reemplaza <username> y <password> con tus credenciales
    const client = new MongoClient(uri);
    const {params} = context;
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
}