import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import ApiKey from "@/models/apiKeys";

// check more here https://jsdoc.app/tags-param
/**
 * @param {import('next/server').NextRequest} request
 */
export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const rawKey = ApiKey.generateKey(); // raw key for client
    const hashedKey = ApiKey.hashKey(rawKey); // store this in DB

    // Create new order
    const apiKey = new ApiKey({
      keyHash: hashedKey,
      name: body.name,
      permission: body.permission,
      isActive: body.isActive ?? true,
    });

    await apiKey.save();

    return NextResponse.json(
      { originalKey: rawKey, ...apiKey._doc },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const keys = await ApiKey.find({});
    return NextResponse.json(keys);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}
