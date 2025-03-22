import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { moveFileToFolder, moveFolderToFolder } from "~/server/actions/move-actions";

export async function POST(request: NextRequest) {
  try {
    const user = await auth();
    if (!user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, itemId, newParentId } = await request.json();
    if (!type || !itemId || !newParentId) {
      return NextResponse.json({ error: "Type, item ID, and new parent ID are required" }, { status: 400 });
    }

    if (type === "file") {
      await moveFileToFolder(BigInt(itemId), BigInt(newParentId));
    } else if (type === "folder") {
      await moveFolderToFolder(BigInt(itemId), BigInt(newParentId));
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error moving item:", error);
    return NextResponse.json({ error: "Failed to move item" }, { status: 500 });
  }
}
