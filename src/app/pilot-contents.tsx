"use client";

import { useState, useEffect } from "react";
import { Breadcrumb } from "./components/breadcrumb";
import { FileList, FolderList } from "./components/file-list";
import { UploadButton } from "./components/upload-button";
import type { files, folders } from "~/server/db/schema";

export default function PilotContents(props: {
  files: (typeof files.$inferSelect)[];
  folders: (typeof folders.$inferSelect)[];
  parents: (typeof folders.$inferSelect)[];
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">Pilot Store</h1>
        <div className="mb-4 flex items-center justify-between">
          <Breadcrumb items={props.parents} />
          <UploadButton />
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
