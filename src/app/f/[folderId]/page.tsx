import PilotContents from "./../../pilot-contents";
import {
  getAllParentsForFolder,
  getFiles,
  getFolders,
} from "~/server/db/queries";

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

  const filesPromise = getFiles(BigInt(safeFolderId));
  const foldersPromise = getFolders(BigInt(safeFolderId));
  const parentPromise = getAllParentsForFolder(BigInt(safeFolderId));

  const [folders, files, parents] = await Promise.all([
    foldersPromise,
    filesPromise,
    parentPromise,
  ]);

  return <PilotContents files={files} folders={folders} parents={parents} />;
}
