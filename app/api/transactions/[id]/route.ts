import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await clientPromise;
  const db = client.db("finance");
  const id = params.id;

  await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ message: "Transaction deleted" });
}