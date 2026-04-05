import { auth } from "@/lib/auth";
import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.LIVEBLOCKS_SECRET_KEY;

if (!secret || !secret.startsWith("sk_")) {
  console.error("❌ LIVEBLOCKS_SECRET_KEY is missing or invalid in .env");
}

const liveblocks = new Liveblocks({
  secret: (secret as string) || "sk_missing",
});

export async function POST(request: NextRequest) {
  // Get the current session from Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { user } = session;

  // Create a Liveblocks session
  const liveblocksSession = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.name ?? "Anonymous User",
      avatar: user.image ?? "",
      id: user.id,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
    },
  });

  // Grant the user access to the room
  // In a real app, you would verify if the user has access to this room.
  const { room } = await request.json();
  liveblocksSession.allow(room, liveblocksSession.FULL_ACCESS);

  // Authorize the session and return the response
  const { body, status } = await liveblocksSession.authorize();
  return new NextResponse(body, { status });
}
