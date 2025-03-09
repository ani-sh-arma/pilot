import PilotHome from "~/app/(home)/page";
import { Queries } from "~/server/db/queries";
import PilotContents from "./pilot-contents";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Pilot(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const safeFolderId = parseInt(params.folderId);
  console.log(`Safe Folder ID : ${safeFolderId}`);
  if (isNaN(safeFolderId)) {
    return (
      <center>
        <h1> {"Invalid folder id"} </h1>
      </center>
    );
  }

  const user = await auth();
  if (!user.userId) {
    console.log(`User not found`);

    return redirect("/");
  }

  const folder = await Queries.getFolderById(BigInt(safeFolderId));
  if (!folder[0] || folder[0].ownerId !== user.userId) {
    console.log(`Folder not found`);
    return redirect("/");
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
    console.log(`Error : ${e}`);
    return redirect("/");
  }
}
