import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("finance");

    if (!params?.id) {
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
    }

    await db.collection("transactions").deleteOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({ message: "Transaction deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
