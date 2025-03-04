'use server'

import { Mutations } from "~/server/db/queries";

export async function deleteFileAction(fileId: bigint, ownerId: string) {
  try {
    await Mutations.deleteFile({
      file: { fileId, ownerId },
    });
  } catch (error) {
    throw new Error('Failed to delete file');
  }
}

// export async function deleteFolderAction(folderId: bigint, ownerId: string) {
//   try {
//     await Mutations.deleteFolder({
//       folder: { folderId, ownerId },
//     });
//   } catch (error) {
//     throw new Error('Failed to delete folder');
//   }
// }
