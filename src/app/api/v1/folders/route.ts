import { type NextRequest, NextResponse } from "next/server";
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

    // Convert BigInt values to strings
    const serializedFolders = folders.map(folder => ({
      ...folder,
      id: folder.id.toString(),
      parentId: folder.parentId?.toString()
    }));

    return NextResponse.json({ folders: serializedFolders });
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

    const data = await request.json() as { folderName?: string; parentId?: string | number };
    if (!data.folderName || !data.parentId) {
      return NextResponse.json({ error: "Folder name and parent ID are required" }, { status: 400 });
    }

    await createFolderAction(data.folderName, Number(data.parentId));
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

    const data = await request.json() as { folderId?: string };
    if (!data.folderId) {
      return NextResponse.json({ error: "Folder ID is required" }, { status: 400 });
    }

    await deleteFolderAction(BigInt(data.folderId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}
