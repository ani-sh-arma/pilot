"use client";

import { useState, useEffect } from "react";
import { Breadcrumb } from "./components/breadcrumb";
import { FileList, FolderList } from "./components/file-list";
import { UploadButton } from "./components/upload-button";
import type { file_table, folder_table } from "~/server/db/schema";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function PilotContents(props: {
  files: (typeof file_table.$inferSelect)[];
  folders: (typeof folder_table.$inferSelect)[];
  parents: (typeof folder_table.$inferSelect)[];
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">Pilot Store</h1>
        <div className="mb-4 flex items-center justify-between">
          <Breadcrumb items={props.parents} />
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
          {/* <UploadButton /> */}
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
