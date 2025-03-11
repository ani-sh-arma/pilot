"use server";

import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { getErrorMessage } from "~/lib/utils/error-handling";
import { Mutations } from "~/server/db/queries";

const utApi = new UTApi();

export async function deleteFileAction(fileId: bigint, fileKey: string) {
  try {
    const user = await auth();
    if (!user.userId) {
      throw new Error("Unauthorized");
    }

    await Mutations.deleteFile({
      file: { fileId, ownerId: user.userId },
    });

    if (fileKey !== "") {
      const res = await utApi.deleteFiles([fileKey]);
      console.log(res);
    } else {
      throw new Error("File key is empty");
    }
  } catch (error) {
    throw new Error(getErrorMessage(error));
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
    throw new Error(`Failed to delete folder: ${getErrorMessage(error)}`);
  }
}
