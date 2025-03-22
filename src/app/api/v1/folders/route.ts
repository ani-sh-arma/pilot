import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Queries } from "~/server/db/queries";
import { createFolderAction, deleteFolderAction } from "~/server/actions/folder-actions";

// Get folders in a parent folder
export async function GET(request: NextRequest) {
  try {
    const user = await auth();
    if (!user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folderId = request.nextUrl.searchParams.get("folderId");
    if (!folderId) {
      return NextResponse.json({ error: "Folder ID is required" }, { status: 400 });
    }

    const folders = await Queries.getFolders(BigInt(folderId));
    return NextResponse.json({ folders });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}

// Create a new folder
export async function POST(request: NextRequest) {
  try {
    const user = await auth();
    if (!user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folderName, parentId } = await request.json();
    if (!folderName || !parentId) {
      return NextResponse.json({ error: "Folder name and parent ID are required" }, { status: 400 });
    }

    await createFolderAction(folderName, Number(parentId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}

// Delete a folder
export async function DELETE(request: NextRequest) {
  try {
    const user = await auth();
    if (!user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folderId } = await request.json();
    if (!folderId) {
      return NextResponse.json({ error: "Folder ID is required" }, { status: 400 });
    }

    await deleteFolderAction(BigInt(folderId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}
