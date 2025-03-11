import { X, Folder, ArrowLeft } from "lucide-react";
import { getAllFolders } from "~/server/actions/move-file-action";
import { useState, useEffect, useRef } from "react";
import type { folder_table } from "~/server/db/schema";

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (folderId: bigint) => Promise<void>;
  title?: string;
  currentFolderId: bigint;
  parentId: bigint | null;
}

export function MoveModal({
  isOpen,
  onClose,
  onMove,
  title = "Select New Parent",
  currentFolderId,
  parentId,
}: MoveModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<bigint>(
    parentId ?? BigInt(0),
  );
  const [folders, setFolders] = useState<(typeof folder_table.$inferSelect)[]>(
    [],
  );
  const [parents, setParents] = useState<(typeof folder_table.$inferSelect)[]>(
    [],
  );

  const isFetching = useRef(false);
  const lastFetchedId = useRef<bigint | null>(null);
  const hasUserNavigated = useRef(false);

  const loadFolders = async (folderId: bigint | null) => {
    if (isFetching.current || lastFetchedId.current === folderId) return;
    isFetching.current = true;
    lastFetchedId.current = folderId;

    console.log(`Fetching folders for folderId: ${folderId}`);

    try {
      const result = await getAllFolders(folderId ?? BigInt(0));

      setFolders([...result[0]]);
      setParents([...result[1]]);

      folders.forEach((folder) => {
        if (folder.id === currentFolderId) {
          return;
        }
      });

      if (!hasUserNavigated.current) {
        setSelectedFolderId(folderId ?? BigInt(0)); // ✅ Only update if user didn't manually navigate
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      isFetching.current = false;
    }
  };

  // Load folders when modal opens, but do NOT override user navigation
  useEffect(() => {
    if (isOpen && !hasUserNavigated.current) {
      void loadFolders(parentId);
    }
  }, [isOpen, parentId]);

  if (!isOpen) {
    hasUserNavigated.current = false;
    return null;
  }

  const handleFolderClick = (folder: typeof folder_table.$inferSelect) => {
    if (folder.id === currentFolderId) return;

    console.log(`Navigating to folder: ${folder.id}`);
    hasUserNavigated.current = true;
    setSelectedFolderId(folder.id);
    void loadFolders(folder.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex h-[80vh] items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="relative z-50 mt-[20vh] h-[80vh] w-[480px] overflow-hidden rounded-lg bg-neutral-900 shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="p-4">
          <div
            className="w-8 rounded-full p-1 hover:cursor-pointer hover:bg-slate-500 hover:text-black"
            onClick={() => {
              void loadFolders(currentFolderId);
            }}
          >
            <ArrowLeft />
          </div>
        </div>

        {/* Folder Selection */}
        <div className="max-h-[40vh] overflow-y-auto p-4">
          <div className="grid gap-4">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className={`flex cursor-pointer items-center rounded-lg bg-gray-800 p-3 transition-colors hover:bg-gray-700`}
                onClick={() => handleFolderClick(folder)}
              >
                <Folder className="mr-3 h-5 w-5" />
                <span className="text-sm">{folder.name}</span>
              </div>
            ))}
            {folders.length === 0 && (
              <div className="text-center text-gray-500">No folders</div>
            )}
          </div>
        </div>

        {/* Move Button */}
        <div className="absolute bottom-0 w-full border-t border-gray-700 p-4">
          <button
            onClick={() => void onMove(selectedFolderId)}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            disabled={selectedFolderId === currentFolderId}
          >
            Move Here
          </button>
        </div>
      </div>
    </div>
  );
}
