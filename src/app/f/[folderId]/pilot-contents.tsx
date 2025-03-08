"use client";

import type { file_table, folder_table } from "~/server/db/schema";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Breadcrumb } from "~/app/components/breadcrumb";
import { UploadButton } from "~/app/components/uploadthing";
import { CreateFolderButton } from "~/app/components/create-folder-button";
import { FolderList, FileList } from "~/app/components/file-list";
import { Cloud } from "lucide-react";

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
        <div className="flex items-center gap-2">
          <Cloud className="h-8 w-8 text-blue-400" />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-2xl font-bold text-transparent">
            Pilot
          </span>
        </div>
        <div className="mb-4 flex flex-col items-center justify-between md:flex-col lg:flex-row">
          <Breadcrumb items={props.parents} />
          <div className="right-0 float-left flex flex-row gap-5">
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
