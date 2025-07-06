import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db("finance");

  const id = context.params.id;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ message: "Deleted" });
}
