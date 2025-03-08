import "server-only";
import { db } from "~/server/db";
import {
  file_table as fileSchema,
  folder_table as folderSchema,
} from "~/server/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export const Queries = {
  getAllParentsForFolder: async function (folderId: bigint) {
    const parents = [];
    let currentId: bigint | null = folderId;
    while (currentId !== null) {
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
      .where(eq(fileSchema.parentId, BigInt(folderId)))
      .orderBy(fileSchema.createdAt);
  },

  getFolders: function (folderId: bigint) {
    return db
      .select()
      .from(folderSchema)
      .where(eq(folderSchema.parentId, BigInt(folderId)))
      .orderBy(folderSchema.createdAt);
  },
  getFolderById: function (folderId: bigint) {
    return db
      .selectDistinct()
      .from(folderSchema)
      .where(eq(folderSchema.id, folderId));
  },
  getRootFolderForUser: async function (userId: string) {
    const folder = await db
      .selectDistinct()
      .from(folderSchema)
      .where(
        and(eq(folderSchema.ownerId, userId), isNull(folderSchema.parentId)),
      );
    return folder[0];
  },
};

export const Mutations = {
  createFile: async function (input: {
    file: {
      name: string;
      type: string;
      ownerId: string;
      parentId: bigint;
      url: string;
      fileKey: string;
      size: string;
    };
  }) {
    return await db.insert(fileSchema).values(input.file);
  },
  deleteFile: async function (input: {
    file: {
      fileId: bigint;
      ownerId: string;
    };
  }) {
    return await db
      .delete(fileSchema)
      .where(
        and(
          eq(fileSchema.id, input.file.fileId),
          eq(fileSchema.ownerId, input.file.ownerId),
        ),
      );
  },
  createFolder: async function (input: {
    folder: {
      name: string;
      ownerId: string;
      parentId: bigint;
    };
  }) {
    return await db.insert(folderSchema).values(input.folder);
  },
};
