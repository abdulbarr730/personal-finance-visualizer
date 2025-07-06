import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await clientPromise;
  const db = client.db();
  const { id } = params;

  await db.collection("budgets").deleteOne({ _id: new ObjectId(id) });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await clientPromise;
  const db = client.db();
  const { id } = params;

  const { category, amount, month } = await req.json();

  await db.collection("budgets").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: { category, amount, month },
    }
  );

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
