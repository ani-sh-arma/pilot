import { Folder, Loader2, MoreVertical, Move, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { deleteFolderAction } from "~/server/actions/folder-actions";
import type { folder_table } from "~/server/db/schema";
import { MoveModal } from "./move-modal";
import { moveFolderToFolder } from "~/server/actions/move-actions";
import toast from "react-hot-toast";

interface FolderListProps {
  folder: typeof folder_table.$inferSelect;

  parent: typeof folder_table.$inferSelect;
}

export function FolderList({ folder, parent }: FolderListProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useRouter();

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
        throw error instanceof Error ? error.message : "Failed to delete folder";
      } finally {
        setIsDeleting(false);
      }
    })();

    await toast.promise(deletePromise, {
      loading: 'Deleting folder...',
      success: (message) => message,
      error: (error) => error,
    });
  };

  const handleMove = async (newParentId: bigint) => {
    const movePromise = (async () => {
      try {
        await moveFolderToFolder(folder.id, newParentId);
        setIsModalOpen(false);
        navigate.refresh();
        return "Folder moved successfully";
      } catch (error) {
        throw error instanceof Error ? error.message : "Failed to move folder";
      }
    })();

    await toast.promise(movePromise, {
      loading: 'Moving folder...',
      success: (message) => message,
      error: (error) => error,
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
      <div
        key={folder.id}
        className="relative flex items-center rounded-lg bg-gray-800 p-4 shadow-md transition-shadow hover:shadow-lg"
      >
        <Link
          href={`/f/${folder.id}`}
          className="flex flex-grow text-lg font-medium text-gray-100 hover:text-blue-400"
        >
          <Folder className="h-6 w-6 text-yellow-400" />
          <div className="ml-4 flex-grow">{folder.name}</div>
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
