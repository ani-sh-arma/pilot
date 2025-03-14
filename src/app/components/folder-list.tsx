import {
  Folder,
  Loader2,
  MoreVertical,
  Move,
  Trash,
  Edit,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  deleteFolderAction,
  renameFolderAction,
} from "~/server/actions/folder-actions";
import type { folder_table } from "~/server/db/schema";
import { MoveModal } from "./move-modal";
import { moveFolderToFolder } from "~/server/actions/move-actions";
import toast from "react-hot-toast";
import { getErrorMessage } from "~/lib/utils/error-handling";
import CustomLoader from "./custom-loader";

interface FolderListProps {
  folder: typeof folder_table.$inferSelect;

  parent: typeof folder_table.$inferSelect;
}

export function FolderList({ folder, parent }: FolderListProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameFolderLoading, setRenameFolderLoading] = useState(false);
  const [folderName, setFolderName] = useState(folder.name);

  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useRouter();

  const handleFolderClick = () => {
    setIsNavigating(true);
    navigate.push(`/f/${folder.id}`);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFolderDelete = async () => {
    const deletePromise = (async () => {
      try {
        setIsDeleting(true);
        await deleteFolderAction(folder.id);
        navigate.refresh();
        return "Folder deleted successfully";
      } catch (error) {
        throw new Error(getErrorMessage(error));
      } finally {
        setIsDeleting(false);
        setShowMenu(false);
      }
    })();

    await toast.promise(deletePromise, {
      loading: "Deleting folder...",
      success: (message) => message,
      error: (error) => getErrorMessage(error),
    });
  };

  const handleMove = async (newParentId: bigint) => {
    const movePromise = (async () => {
      try {
        await moveFolderToFolder(folder.id, newParentId);
        setIsModalOpen(false);
        navigate.refresh();
        setShowMenu(false);
        return "Folder moved successfully";
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    })();

    await toast.promise(movePromise, {
      loading: "Moving folder...",
      success: (message) => message,
      error: (error) => getErrorMessage(error),
    });
  };

  const handleRenameFolder = async () => {
    setRenameFolderLoading(true);
    const createFolderPromise = async () => {
      try {
        await renameFolderAction(folderName, Number(folder.id));
        setFolderName("");
        setIsModalOpen(false);

        return `Renamed Folder "${folder.name}" to "${folderName}" successfully`;
      } catch (e) {
        throw new Error(getErrorMessage(e));
      }
    };
    setIsRenameModalOpen(false);
    setRenameFolderLoading(false);
    navigate.refresh();
    await toast.promise(createFolderPromise, {
      loading: `Renaming Folder "${folder.name}" to "${folderName}"`,
      success: (message) => message,
      error: (error) => getErrorMessage(error),
    });
  };

  return (
    <>
      {isModalOpen && (
        <MoveModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onMove={handleMove}
          currentFolderId={folder.id}
          currentFileOrFolder={folder.name ?? ""}
          title={`Move "${folder.name}" to: ${parent.name}`}
          parentId={folder.parentId}
        />
      )}

      {isRenameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative z-50 w-96 rounded-lg bg-neutral-900 p-6 shadow-lg">
            <button
              onClick={() => setIsRenameModalOpen(false)}
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
                  await handleRenameFolder();
                }
              }}
              className="mb-4 w-full rounded-md border border-gray-300 p-2 text-black focus:border-blue-500 focus:outline-none"
            />
            {renameFolderLoading ? (
              <CustomLoader />
            ) : (
              <button
                onClick={handleRenameFolder}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                {"Create Folder"}
              </button>
            )}
          </div>
        </div>
      )}
      <div
        key={folder.id}
        className="relative flex items-center rounded-lg bg-gray-800 p-4 shadow-md transition-shadow hover:shadow-lg"
      >
        <Link
          href={`/f/${folder.id}`}
          onClick={handleFolderClick}
          className="flex flex-grow text-lg font-medium text-gray-100 hover:text-blue-400"
        >
          <Folder className="h-6 w-6 text-yellow-400" />
          <div className="ml-4 flex-grow">
            {isNavigating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Opening...</span>
              </div>
            ) : (
              folder.name
            )}
          </div>
        </Link>
        <div className="relative" ref={menuRef}>
          <button
            className="ml-4 p-1 hover:text-gray-300"
            onClick={(e) => {
              e.preventDefault();
              setShowMenu(!showMenu);
            }}
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 z-50 w-48 rounded-md bg-gray-700 py-1 shadow-lg">
              {isDeleting ? (
                <div className="flex items-center justify-center px-4 py-4 text-sm text-gray-200">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsRenameModalOpen(true);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Rename
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                  >
                    <Move className="mr-2 h-4 w-4" />
                    Move To
                  </button>
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                    onClick={handleFolderDelete}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
