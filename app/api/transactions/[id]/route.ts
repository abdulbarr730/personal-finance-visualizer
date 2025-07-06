import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ✅ REMOVE all explicit types on the second argument!
export async function DELETE(request: Request, { params }: any) {
  const id = params.id;

  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("finance");

  await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ message: "Transaction deleted" });
}
