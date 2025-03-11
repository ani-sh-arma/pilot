"use server";

import { auth } from "@clerk/nextjs/server";
import { Mutations } from "../db/queries";

export async function moveFileToFolder(fileId: bigint, newParentId: bigint) {
  const user = await auth();
  if (!user.userId) {
    throw new Error("Unauthorized");
  }

  await Mutations.moveFileTo({
    file: {
      fileId,
      ownerId: user.userId,
      newParentId,
    },
  });
}

export async function moveFolderToFolder(folderId: bigint, newParentId: bigint) {
  const user = await auth();
  if (!user.userId) {
    throw new Error("Unauthorized");
  }

  await Mutations.moveFolderTo({
    folder: {
      folderId,
      ownerId: user.userId,
      newParentId,
    },
  });
}
