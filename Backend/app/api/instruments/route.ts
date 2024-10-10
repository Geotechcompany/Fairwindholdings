import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getInstruments } from "@/lib/oandaClient/route";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const instruments = await getInstruments();
    return NextResponse.json(instruments);
  } catch (error) {
    console.error("Error fetching instruments:", error);
    return NextResponse.json({ error: "Failed to fetch instruments" }, { status: 500 });
  }
}