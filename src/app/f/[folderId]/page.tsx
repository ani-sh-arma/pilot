import PilotHome from "~/app/page";
import PilotContents from "./../../pilot-contents";
import { Queries } from "~/server/db/queries";

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

  try {
    const filesPromise = Queries.getFiles(BigInt(safeFolderId));
    const foldersPromise = Queries.getFolders(BigInt(safeFolderId));
    const parentPromise = Queries.getAllParentsForFolder(BigInt(safeFolderId));
    const [folders, files, parents] = await Promise.all([
      foldersPromise,
      filesPromise,
      parentPromise,
    ]);
    return (
      <PilotContents
        files={files}
        folders={folders}
        parents={parents}
        folderId={safeFolderId}
      />
    );
  } catch (e) {
    console.log(e);
    return <PilotHome />;
  }
}
