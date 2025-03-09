import "server-only";
import { db } from "~/server/db";
import {
  file_table as fileSchema,
  folder_table as folderSchema,
} from "~/server/db/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";

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
      parentId: bigint | null;
    };
  }) {
    return await db.insert(folderSchema).values(input.folder);
  },
  deleteFolder: async function (input: {
    folder: {
      folderId: bigint;
      ownerId: string;
    };
  }) {
    // Get all subfolders recursively
    const getAllSubFolders = async (folderId: bigint): Promise<bigint[]> => {
      const subFolders = await db
        .select({ id: folderSchema.id })
        .from(folderSchema)
        .where(eq(folderSchema.parentId, folderId));

      const subFolderIds = subFolders.map((f) => f.id);
      const childFolderIds = await Promise.all(
        subFolderIds.map((id) => getAllSubFolders(id)),
      );

      return [folderId, ...childFolderIds.flat()];
    };

    const folderIds = await getAllSubFolders(input.folder.folderId);

    // Delete all files in all folders
    await db
      .delete(fileSchema)
      .where(
        and(
          eq(fileSchema.ownerId, input.folder.ownerId),
          folderIds.length > 0
            ? inArray(fileSchema.parentId, folderIds)
            : undefined,
        ),
      );

    // Delete all subfolders and the main folder
    await db
      .delete(folderSchema)
      .where(
        and(
          eq(folderSchema.ownerId, input.folder.ownerId),
          folderIds.length > 0
            ? inArray(folderSchema.id, folderIds)
            : undefined,
        ),
      );
  },
  onBoardUser: async function (ownerId: string) {
    const root = await Queries.getRootFolderForUser(ownerId);
    if (root) {
      return root.id;
    }

    const folder = await db
      .insert(folderSchema)
      .values({
        name: "Home",
        ownerId: ownerId,
        parentId: null,
      })
      .$returningId();

    const rootId = folder[0]!.id;

    await db.insert(folderSchema).values([
      {
        name: "Documents",
        ownerId: ownerId,
        parentId: rootId,
      },
      {
        name: "Pictures",
        ownerId: ownerId,
        parentId: rootId,
      },
    ]);

    return rootId;
  },
};
