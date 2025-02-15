import { db } from "~/server/db";
import {
  files as fileSchema,
  folders as folderSchema,
} from "~/server/db/schema";
import PilotContents from "./../../pilot-contents";
import { eq } from "drizzle-orm";

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

  console.log(safeFolderId);

  const files = await db
    .select()
    .from(fileSchema)
    .where(eq(fileSchema.parentId, BigInt(safeFolderId)));

  const folders = await db
    .select()
    .from(folderSchema)
    .where(eq(folderSchema.parentId, BigInt(safeFolderId)));

  return <PilotContents files={files} folders={folders} />;
}
