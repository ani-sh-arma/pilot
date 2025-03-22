import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Queries } from "~/server/db/queries";

export async function GET() {
  try {
    const user = await auth();
    if (!user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's root folder
    const rootFolder = await Queries.getRootFolderForUser(user.userId);

    return NextResponse.json({
      userId: user.userId,
      rootFolderId: rootFolder?.id.toString(),
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}
