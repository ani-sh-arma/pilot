import { X, Folder, ArrowLeft } from "lucide-react";
import { getAllFolders } from "~/server/actions/move-file-action";
import { useState, useEffect, useCallback } from "react";
import type { folder_table } from "~/server/db/schema";
import { getFolderByIdAction } from "~/server/actions/folder-actions";
import { getErrorMessage } from "~/lib/utils/error-handling";

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (folderId: bigint) => Promise<void>;
  title?: string;
  currentFolderId: bigint;
  currentFileOrFolder: string;
  parentId: bigint | null;
}

export function MoveModal({
  isOpen,
  onClose,
  onMove,
  title = "Select New Parent",
  currentFolderId,
  currentFileOrFolder,
  parentId,
}: MoveModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<bigint>(
    parentId ?? BigInt(0),
  );

  const [dialogueTitle, setDialogueTitle] = useState<string>(title);
  const [showBack, setShowBack] = useState<boolean>(true);
  const [folders, setFolders] = useState<(typeof folder_table.$inferSelect)[]>(
    [],
  );

  const loadFolders = useCallback(
    async (folderId: bigint | null) => {
      if (folderId === null) {
        setShowBack(false);
        return;
      }

      console.log(`Fetching folders for folderId: ${folderId}`);

      try {
        const result = await getAllFolders(folderId ?? BigInt(0));

        const filteredFolders = result[0].filter(
          (folder) => folder.id !== currentFolderId,
        );

        setFolders(filteredFolders);
        setSelectedFolderId(folderId ?? BigInt(0));
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    },
    [currentFolderId],
  );

  // Load folders when modal opens, but do NOT override user navigation
  useEffect(() => {
    void loadFolders(parentId);
  }, [isOpen, parentId, loadFolders]);

  if (!isOpen) {
    return null;
  }

  const handleFolderClick = (folder: typeof folder_table.$inferSelect) => {
    if (folder.id === currentFolderId) return;

    console.log(`Navigating to folder: ${folder.id}`);
    setSelectedFolderId(folder.id);
    void loadFolders(folder.id);
    setDialogueTitle(`Move "${currentFileOrFolder}" to : ${folder.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex h-[80vh] items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="relative z-50 mt-[20vh] h-[80vh] w-[480px] overflow-hidden rounded-lg bg-neutral-900 shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h2 className="text-lg font-semibold">{dialogueTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Breadcrumb Navigation */}
        {showBack && (
          <div className="p-4">
            <div
              className="w-8 rounded-full p-1 hover:cursor-pointer hover:bg-slate-500 hover:text-black"
              onClick={async () => {
                try {
                  console.log("Loading folders for current folder");
                  const folder = await getFolderByIdAction(selectedFolderId);
                  console.log("Folder:", folder[0]?.parentId);
                  void loadFolders(folder[0]?.parentId ?? null);
                  const parentFolder = await getFolderByIdAction(
                    folder[0]?.parentId ?? BigInt(0),
                  );
                  setDialogueTitle(
                    `Move "${currentFileOrFolder}" to : ${parentFolder[0]?.name}`,
                  );
                } catch (e) {
                  console.log(`Error: ${getErrorMessage(e)}`);
                }
              }}
            >
              <ArrowLeft />
            </div>
          </div>
        )}

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
