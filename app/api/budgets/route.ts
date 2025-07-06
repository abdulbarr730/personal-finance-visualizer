import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("finance");
  const budgets = await db.collection("budgets").find({}).toArray();
  return NextResponse.json(budgets);
}

export async function POST(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db("finance");
  const { category, amount, month } = await req.json();

  await db.collection("budgets").updateOne(
    { category, month },
    { $set: { amount } },
    { upsert: true }
  );

  return NextResponse.json({ message: "Budget saved" });
}
