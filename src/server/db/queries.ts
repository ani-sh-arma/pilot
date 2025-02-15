import "server-only";
import { db } from "~/server/db";
import {
  file_table as fileSchema,
  folder_table as folderSchema,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const Queries = {
  getAllParentsForFolder: async function (folderId: bigint) {
    const parents = [];
    let currentId: bigint | null = folderId;
    while (currentId !== BigInt(1)) {
      if (currentId === null) {
        throw new Error("Invalid folder id");
      }
      const folder = await db
        .selectDistinct()
        .from(folderSchema)
        .where(eq(folderSchema.id, currentId));

      if (!folder[0]) {
        throw new Error("Invalid folder id");
      }
      parents.unshift(folder[0]);
      currentId = folder[0]?.parentId;
    }

    return parents;
  },

  getFiles: function (folderId: bigint) {
    return db
      .select()
      .from(fileSchema)
      .where(eq(fileSchema.parentId, BigInt(folderId)));
  },

  getFolders: function (folderId: bigint) {
    return db
      .select()
      .from(folderSchema)
      .where(eq(folderSchema.parentId, BigInt(folderId)));
  },
};
