import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Queries } from "~/server/db/queries";
import { deleteFileAction } from "~/server/actions/file-actions";

// Get files in a folder
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

    const files = await Queries.getFiles(BigInt(folderId));

    // Convert BigInt values to strings before serializing to JSON
    const serializedFiles = files.map(file => ({
      ...file,
      id: file.id.toString(),
      parentId: file.parentId.toString()
    }));

    return NextResponse.json({ files: serializedFiles });
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

// Delete a file
export async function DELETE(request: NextRequest) {
  try {
    const user = await auth();
    if (!user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId, fileKey } = await request.json();
    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }

    await deleteFileAction(BigInt(fileId), fileKey || "");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
