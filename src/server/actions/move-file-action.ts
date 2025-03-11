"use server";

import { Queries } from "~/server/db/queries";

export async function getAllFolders(parentId: bigint) {
  try {
    const foldersPromise = Queries.getFolders(parentId);
    const parentPromise = Queries.getAllParentsForFolder(parentId);
    const [folders, parents] = await Promise.all([
      foldersPromise,
      parentPromise,
    ]);
    return [folders, parents] as const;
  } catch (error) {
    console.error("Error fetching folders:", error);
    return [[], []] as const;
  }
}
