import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = new URL("https://roobetconnect.com/affiliate/v2/stats");

    url.searchParams.append("userId", process.env.ROOBET_USER_ID);
    url.searchParams.append("categories", "blackjack,slots,provably fair");
    url.searchParams.append("gameIdentifiers", "-housegames:dice");
    url.searchParams.append("sortBy", "wagered");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.ROOBET_API_TOKEN}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "API error" }, { status: 500 });
  }
}