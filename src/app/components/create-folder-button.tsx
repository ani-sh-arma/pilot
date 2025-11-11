"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { createFolderAction } from "~/server/actions/folder-actions";
import { getErrorMessage } from "~/lib/utils/error-handling";
import CustomLoader from "./custom-loader";
import toast from "react-hot-toast";

export function CreateFolderButton(props: {
  parentId: number;
  onCreated: () => void;
}) {
  const [createFolderLoading, setCreateFolderLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = async () => {
    setCreateFolderLoading(true);
    const createFolderPromise = async () => {
      try {
        setIsModalOpen(false);
        await createFolderAction(folderName, props.parentId);
        props.onCreated();
        setFolderName("");

        return "Folder Created";
      } catch (e) {
        throw new Error(getErrorMessage(e));
      }
    };
    setCreateFolderLoading(false);
    await toast.promise(createFolderPromise, {
      loading: "Creating Folder...",
      success: (message) => message,
      error: (error) => getErrorMessage(error),
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create
        </button>
        <p className="mt-1 text-sm text-gray-600">New Folder</p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative z-50 w-96 rounded-lg bg-neutral-900 p-6 shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-4 text-lg font-semibold">Create New Folder</h2>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              autoFocus
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  await handleCreateFolder();
                }
              }}
              className="mb-4 w-full rounded-md border border-gray-300 p-2 text-black focus:border-blue-500 focus:outline-none"
            />
            {createFolderLoading ? (
              <CustomLoader />
            ) : (
              <button
                onClick={handleCreateFolder}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                {"Create Folder"}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
