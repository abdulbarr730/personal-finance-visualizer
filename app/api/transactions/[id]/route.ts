// app/api/transactions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Must match Next.js App Router's dynamic segment format
export async function DELETE(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  const id = context.params.id;

  const client = await clientPromise;
  const db = client.db("finance");

  await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ message: "Transaction deleted" });
}
