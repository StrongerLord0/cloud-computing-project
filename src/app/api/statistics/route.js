import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function GET () {
    const uri = process.env.MONGO_URL; // Reemplaza <username> y <password> con tus credenciales
    const client = new MongoClient(uri);

    try {
        await client.connect();

        const collection = client.db("ByOx").collection("statistics");
        const stats = await collection.find({}).toArray();

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({ error: 'Error connecting to database' });
    } finally {
        await client.close();
    }
}

export async function POST (request) {
    const uri = process.env.MONGO_URL; // Reemplaza <username> y <password> con tus credenciales
    const client = new MongoClient(uri);
    const data = await request.json();
    try {
        await client.connect();

        const collection = client.db("ByOx").collection("statistics");
        const stats = await collection.insertOne(data);

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({ error: 'Error connecting to database' });
    } finally {
        await client.close();
    }
}