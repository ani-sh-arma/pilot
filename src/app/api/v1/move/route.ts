import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { moveFileToFolder, moveFolderToFolder } from "~/server/actions/move-actions";

export async function POST(request: NextRequest) {
  try {
    const user = await auth();
    if (!user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json() as {
      type?: "file" | "folder";
      itemId?: string;
      newParentId?: string
    };

    if (!data.type || !data.itemId || !data.newParentId) {
      return NextResponse.json({ error: "Type, item ID, and new parent ID are required" }, { status: 400 });
    }

    if (data.type === "file") {
      await moveFileToFolder(BigInt(data.itemId), BigInt(data.newParentId));
    } else if (data.type === "folder") {
      await moveFolderToFolder(BigInt(data.itemId), BigInt(data.newParentId));
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error moving item:", error);
    return NextResponse.json({ error: "Failed to move item" }, { status: 500 });
  }
}
