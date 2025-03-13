"use server";

import { auth } from "@clerk/nextjs/server";
import { AppError, getErrorMessage } from "~/lib/utils/error-handling";
import { Mutations, Queries } from "~/server/db/queries";

export async function createFolderAction(folderName: string, parentId: number) {
  try {
    const user = await auth();
    if (!user.userId) throw new AppError("Unauthorized");

    const folder = await Queries.getFolderById(BigInt(parentId));

    if (!folder) throw new AppError("Invalid folder id");

    if (folder[0]?.ownerId !== user.userId) throw new AppError("Unauthorized");

    await Mutations.createFolder({
      folder: {
        name: folderName,
        ownerId: user.userId,
        parentId: BigInt(parentId),
      },
    });
  } catch (error) {
    throw new AppError(
      error instanceof Error ? error.message : "Failed to create folder",
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
    throw new Error(`Failed to delete folder: ${getErrorMessage(error)}`);
  }
}

export async function getFolderByIdAction(folderId: bigint) {
  try {
    const user = await auth();
    if (!user.userId) throw new AppError("Unauthorized");

    const folder = await Queries.getFolderById(BigInt(folderId));

    return folder;
  } catch (error) {
    throw new AppError(
      error instanceof Error ? error.message : "Failed to create folder",
    );
  }
}
