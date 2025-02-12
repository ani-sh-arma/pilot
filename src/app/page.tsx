"use client";

import { useState, useEffect } from "react";
import { type File, Folder, mockFiles, mockFolders } from "../lib/mock-data";
import { Breadcrumb } from "./components/breadcrumb";
import { FileList, FolderList } from "./components/file-list";
import { UploadButton } from "./components/upload-button";
import { get } from "http";

export default function DrivePage() {
  const [currentFolder, setCurrentFolder] = useState<string>("root");

  const getCurrentFolder = () => {
    return mockFolders.find((folder) => folder.id === currentFolder);
  };

  const getCurrentFiles = () => {
    const files: File[] = [];
    mockFiles.forEach((file) => {
      if (file.parentId === currentFolder) {
        files.push(file);
      }
    });
    return files;
  };
  const getCurrentFolders = () => {
    const folders: Folder[] = [];
    mockFolders.forEach((folder) => {
      if (folder.parentId === currentFolder) {
        folders.push(folder);
      }
    });
    return folders;
  };

  const [breadcrumbs, setBreadcrumbs] = useState<Folder[]>(
    mockFolders.length > 0 && mockFolders[0] ? [mockFolders[0]] : [],
  );

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleFolderClick = (folder: Folder) => {
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
          {getCurrentFolders()?.map((folder) => (
            <FolderList
              folder={folder}
              onFolderClick={handleFolderClick}
              key={folder.id}
            />
          ))}
          {getCurrentFiles()?.map((file) => (
            <FileList file={file} key={file.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
