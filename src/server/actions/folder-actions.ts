"use server";

import { auth } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";
import { Mutations, Queries } from "~/server/db/queries";

export async function createFolderAction(folderName: string, parentId: number) {
  try {
    const user = await auth();
    if (!user.userId) throw new Error("Unauthorized");

    const folder = await Queries.getFolderById(BigInt(parentId));

    if (!folder) throw new Error("Invalid folder id");

    if (folder[0]?.ownerId !== user.userId) throw new Error("Unauthorized");

    await Mutations.createFolder({
      folder: {
        name: folderName,
        ownerId: user.userId,
        parentId: BigInt(parentId),
      },
    });
  } catch (e) {
    throw new Error(`An error occurred ${e}`);
  }
}
