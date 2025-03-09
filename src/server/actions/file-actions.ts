"use server";

import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { Mutations } from "~/server/db/queries";

const utApi = new UTApi();

export async function deleteFileAction(fileId: bigint, fileKey: string) {
  try {
    const user = await auth();
    if (!user.userId) {
      throw new Error("Unauthorized");
    }

    if (fileKey !== "") {
      const res = await utApi.deleteFiles([fileKey]);
      console.log(res);
    } else {
      throw new Error("File key is empty");
    }

    await Mutations.deleteFile({
      file: { fileId, ownerId: user.userId },
    });
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Failed to delete file: ${error.message}`
        : "Failed to delete file",
    );
  }
}

export async function deleteFolderAction(folderId: bigint) {
  try {
    const user = await auth();
    if (!user.userId) {
      throw new Error("Unauthorized");
    }
    await Mutations.deleteFolder({
      folder: { folderId, ownerId: user.userId },
    });
  } catch (error) {
    throw new Error("Failed to delete folder");
  }
}
