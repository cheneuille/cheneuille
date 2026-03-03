import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = process.env.ROOBET_USER_ID;
    const apiToken = process.env.ROOBET_API_TOKEN;

    // Vérification obligatoire
    if (!userId || !apiToken) {
      throw new Error("Missing ROOBET_USER_ID or ROOBET_API_TOKEN environment variable");
    }

    const url = new URL("https://roobetconnect.com/affiliate/v2/stats");
    url.searchParams.append("userId", userId);
    url.searchParams.append("categories", "blackjack,slots,provably fair");
    url.searchParams.append("gameIdentifiers", "-housegames:dice");
    url.searchParams.append("sortBy", "wagered");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "API error" }, { status: 500 });
  }
}