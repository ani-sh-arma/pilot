"use client";

import { Breadcrumb } from "./components/breadcrumb";
import { FileList, FolderList } from "./components/file-list";
import type { file_table, folder_table } from "~/server/db/schema";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UploadButton } from "./components/uploadthing";
import { useRouter } from "next/navigation";

export default function PilotContents(props: {
  files: (typeof file_table.$inferSelect)[];
  folders: (typeof folder_table.$inferSelect)[];
  parents: (typeof folder_table.$inferSelect)[];
  folderId: number;
}) {
  const navigate = useRouter();
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">Pilot Store</h1>
        <div className="mb-4 flex items-center justify-between">
          <Breadcrumb items={props.parents} />
          <div className="flex flex-row gap-5">
            <div className="flex items-center gap-2">
              <UploadButton
                endpoint={"imageUploader"}
                onClientUploadComplete={() => {
                  navigate.refresh();
                }}
                input={{ folderId: props.folderId }}
              />
            </div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {props.folders.map((folder) => (
            <FolderList folder={folder} key={folder.id} />
          ))}
          {props.files.map((file) => (
            <FileList file={file} key={file.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
