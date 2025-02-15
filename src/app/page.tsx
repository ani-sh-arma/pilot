import { db } from "~/server/db";
import {
  files as fileSchema,
  folders as folderSchema,
} from "~/server/db/schema";
import PilotContents from "./pilot-contents";

export default async function Pilot() {
  const files = await db.select().from(fileSchema);
  const folders = await db.select().from(folderSchema);

  return <PilotContents files={files} folders={folders} />;
}
