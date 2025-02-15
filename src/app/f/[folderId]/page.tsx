import { db } from "~/server/db";
import {
  file_table as fileSchema,
  folder_table as folderSchema,
} from "~/server/db/schema";
import PilotContents from "./../../pilot-contents";
import { eq } from "drizzle-orm";

async function getAllParents(folderId: bigint) {
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
}

export default async function Pilot(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const safeFolderId = parseInt(params.folderId);
  if (isNaN(safeFolderId)) {
    return (
      <center>
        <h1> {"Invalid folder id"} </h1>
      </center>
    );
  }

  const filesPromise = db
    .select()
    .from(fileSchema)
    .where(eq(fileSchema.parentId, BigInt(safeFolderId)));

  const foldersPromise = db
    .select()
    .from(folderSchema)
    .where(eq(folderSchema.parentId, BigInt(safeFolderId)));

  const parentPromise = getAllParents(BigInt(safeFolderId));

  const [folders, files, parents] = await Promise.all([
    foldersPromise,
    filesPromise,
    parentPromise,
  ]);

  return <PilotContents files={files} folders={folders} parents={parents} />;
}
