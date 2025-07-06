import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: Request,
  context: { params: Record<string, string | string[]> }
) {
  const { id } = context.params;

  const client = await clientPromise;
  const db = client.db("finance");

  if (!id || Array.isArray(id) || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ message: "Deleted" });
}
