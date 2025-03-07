"use client";

import type { file_table, folder_table } from "~/server/db/schema";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Breadcrumb } from "~/app/components/breadcrumb";
import { UploadButton } from "~/app/components/uploadthing";
import { CreateFolderButton } from "~/app/components/create-folder-button";
import { FolderList, FileList } from "~/app/components/file-list";

export default function PilotContents(props: {
  files: (typeof file_table.$inferSelect)[];
  folders: (typeof folder_table.$inferSelect)[];
  parents: (typeof folder_table.$inferSelect)[];
  folderId: number;
}) {
  const [error, setError] = useState("");
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
                endpoint={"pilotUploader"}
                onClientUploadComplete={() => {
                  navigate.refresh();
                }}
                onUploadError={(error) => {
                  setError(
                    error instanceof Error ? error.message : "Upload failed",
                  );
                }}
                input={{ folderId: props.folderId }}
              />
              <CreateFolderButton
                parentId={props.folderId}
                onCreated={() => {
                  navigate.refresh();
                }}
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

        {error !== "" && <div className="text-red-500">{error}</div>}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {props.folders.length === 0 && props.files.length === 0 && (
            <h1 className="text-gray-500">{"No files or folders"}</h1>
          )}
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
