import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { Mutations } from "~/server/db/queries";
import { audioTypes, docTypes, imageTypes, videoTypes } from "~/lib/mock-data";

const utApi = new UTApi();

export async function POST(request: NextRequest) {
  try {
    const user = await auth();
    if (!user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folderId = formData.get("folderId") as string;

    if (!file || !folderId) {
      return NextResponse.json(
        { error: "File and folder ID are required" },
        { status: 400 },
      );
    }

    // Upload to UploadThing
    const uploadResult = await utApi.uploadFiles(file);

    if (!uploadResult.data) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // Determine file type
    let type = "file";
    const fileExt = file.name.split(".").pop()?.toLowerCase() ?? "";

    if (imageTypes.includes(fileExt)) type = "image";
    else if (videoTypes.includes(fileExt)) type = "video";
    else if (audioTypes.includes(fileExt)) type = "audio";
    else if (docTypes.includes(fileExt)) type = "doc";

    // Save file info to database
    await Mutations.createFile({
      file: {
        name: file.name,
        type: type,
        ownerId: user.userId,
        parentId: BigInt(folderId),
        url: uploadResult.data.url,
        fileKey: uploadResult.data.key,
        size: file.size.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.data.url,
      key: uploadResult.data.key,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
