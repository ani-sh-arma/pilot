import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Mutations, Queries } from "~/server/db/queries";

export async function POST() {
  try {
    const user = await auth();
    if (!user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already has a root folder
    const existingRoot = await Queries.getRootFolderForUser(user.userId);
    if (existingRoot) {
      return NextResponse.json({
        message: "User already onboarded",
        rootFolderId: existingRoot.id.toString()
      });
    }

    // Create root folder for user
    const rootFolderId = await Mutations.onBoardUser(user.userId);

    return NextResponse.json({
      success: true,
      rootFolderId: rootFolderId.toString()
    });
  } catch (error) {
    console.error("Error onboarding user:", error);
    return NextResponse.json({ error: "Failed to onboard user" }, { status: 500 });
  }
}
