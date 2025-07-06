import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("finance");
  const transactions = await db.collection("transactions").find({}).sort({ date: -1 }).toArray();
  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const { amount, description, date } = await req.json();
  const client = await clientPromise;
  const db = client.db("finance");
  const result = await db.collection("transactions").insertOne({
    amount: Number(amount),
    description,
    date: new Date(date),
  });
  return NextResponse.json({ insertedId: result.insertedId });
}
