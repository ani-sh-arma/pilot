"use client";

import type { file_table, folder_table } from "~/server/db/schema";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Breadcrumb } from "~/app/components/breadcrumb";
import { UploadButton } from "~/app/components/uploadthing";
import { CreateFolderButton } from "~/app/components/create-folder-button";
import { FileList } from "~/app/components/file-list";
import { Cloud, MoreVertical } from "lucide-react";
import { FolderList } from "~/app/components/folder-list";

export default function PilotContents(props: {
  files: (typeof file_table.$inferSelect)[];
  folders: (typeof folder_table.$inferSelect)[];
  parents: (typeof folder_table.$inferSelect)[];
  folder: typeof folder_table.$inferSelect;
}) {
  const [error, setError] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useRouter();

  // Handle clicks outside the mobile menu to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-8 w-8 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-2xl font-bold text-transparent">
              Pilot
            </span>
          </div>

          {/* Mobile menu button */}
          <div className="relative flex lg:hidden" ref={mobileMenuRef}>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="rounded-full p-2 hover:bg-gray-800"
            >
              <MoreVertical className="h-6 w-6" />
            </button>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

            {/* Mobile dropdown menu */}
            {showMobileMenu && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md bg-gray-800 py-2 shadow-lg">
                <div className="px-4 py-2">
                  <UploadButton
                    endpoint={"pilotUploader"}
                    onClientUploadComplete={() => {
                      navigate.refresh();
                      setShowMobileMenu(false);
                    }}
                    onUploadError={(error) => {
                      setError(
                        error instanceof Error
                          ? error.message
                          : "Upload failed",
                      );
                    }}
                    input={{ folderId: Number(props.folder.id) }}
                  />
                </div>
                <div className="px-4 py-2">
                  <CreateFolderButton
                    parentId={Number(props.folder.id)}
                    onCreated={() => {
                      navigate.refresh();
                      setShowMobileMenu(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 flex flex-col items-start justify-between lg:flex-row lg:items-center">
          {/* Breadcrumb - always visible */}
          <Breadcrumb items={props.parents} />

          {/* Desktop action buttons - only visible on large screens */}
          <div className="mt-4 hidden lg:flex lg:items-center lg:gap-5">
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
                input={{ folderId: Number(props.folder.id) }}
              />
              <CreateFolderButton
                parentId={Number(props.folder.id)}
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
            <FolderList folder={folder} key={folder.id} parent={props.folder} />
          ))}
          {props.files.map((file) => (
            <FileList file={file} key={file.id} parent={props.folder} />
          ))}
        </div>
      </div>
    </div>
  );
}
