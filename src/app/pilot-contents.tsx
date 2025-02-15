"use client";

import { useState, useEffect } from "react";
import { Breadcrumb } from "./components/breadcrumb";
import { FileList, FolderList } from "./components/file-list";
import { UploadButton } from "./components/upload-button";
import type { files, folders } from "~/server/db/schema";

export default function PilotContents(props: {
  files: (typeof files.$inferSelect)[];
  folders: (typeof folders.$inferSelect)[];
}) {
  const [currentFolder, setCurrentFolder] = useState<bigint>(BigInt(1));

  const getCurrentFolder = () => {
    return props.folders.find((folder) => folder.id === currentFolder);
  };

  const [breadcrumbs, setBreadcrumbs] = useState<
    (typeof folders.$inferSelect)[]
  >(props.folders.length > 0 && props.folders[0] ? [props.folders[0]] : []);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleFolderClick = (folder: typeof folders.$inferSelect) => {
    if (!folder) return;
    setCurrentFolder(folder.id);
    setBreadcrumbs((prev) => [...prev, folder]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    const lastBreadcrumb = newBreadcrumbs[newBreadcrumbs.length - 1];
    if (lastBreadcrumb) {
      setBreadcrumbs(newBreadcrumbs);
      setCurrentFolder(lastBreadcrumb.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">Pilot Store</h1>
        <div className="mb-4 flex items-center justify-between">
          <Breadcrumb items={breadcrumbs} onItemClick={handleBreadcrumbClick} />
          <UploadButton />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {props.folders.map((folder) => (
            <FolderList
              folder={folder}
              onFolderClick={handleFolderClick}
              key={folder.id}
            />
          ))}
          {props.files.map((file) => (
            <FileList file={file} key={file.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
