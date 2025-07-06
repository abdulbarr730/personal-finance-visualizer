// app/api/transactions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req: NextRequest, context: any) {
  const id = context.params.id;

  const client = await clientPromise;
  const db = client.db("finance");

  await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ message: "Transaction deleted" });
}
