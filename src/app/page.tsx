"use client";

import { useState, useEffect } from "react";
import { type FileItem, mockFiles } from "../lib/mock-data";
import { Breadcrumb } from "./components/breadcrumb";
import { FileList } from "./components/file-list";
import { UploadButton } from "./components/upload-button";

export default function DrivePage() {
  const [currentFolder, setCurrentFolder] = useState<string>("1");
  const [breadcrumbs, setBreadcrumbs] = useState<FileItem[]>(
    mockFiles.length > 0 && mockFiles[0] ? [mockFiles[0]] : [],
  );

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleFolderClick = (folder: FileItem) => {
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
        <FileList
          files={mockFiles.filter((file) => file?.parentId === currentFolder)}
          onFolderClick={handleFolderClick}
        />
      </div>
    </div>
  );
}
