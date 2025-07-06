// app/api/transactions/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("finance");
  const transactions = await db
    .collection("transactions")
    .find({})
    .sort({ date: -1 })
    .toArray();
  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  const client = await clientPromise;
  const db = client.db("finance");

  const body = await request.json();
  const { amount, description, date, category } = body;

  const result = await db.collection("transactions").insertOne({
    amount,
    description,
    date,
    category,
  });

  return NextResponse.json({ insertedId: result.insertedId });
}
