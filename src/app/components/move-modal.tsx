import { X, Folder } from "lucide-react";
import { getAllFolders } from "~/server/actions/move-file-action";
import { Breadcrumb } from "./breadcrumb";
import { useState } from "react";
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
  const [selectedFolderId, setSelectedFolderId] =
    useState<bigint>(currentFolderId);
  const [folders, setFolders] = useState<(typeof folder_table.$inferSelect)[]>(
    [],
  );
  const [parents, setParents] = useState<(typeof folder_table.$inferSelect)[]>(
    [],
  );

  if (!isOpen) return null;

  const loadFolders = async (parentId: bigint | null) => {
    console.log(`In load folders : ${parentId}`);

    const result = await getAllFolders(parentId ?? BigInt(0));
    console.log(`In load folders after result : ${result}`);
    setFolders([...result[0]]);
    console.log(`In load folders after setfolder : ${folders}`);
    setParents([...result[1]]);
    console.log(`In load folders after setparent : ${parents}`);
    setSelectedFolderId(parentId ?? BigInt(0));
  };

  // Initial load
  if (folders.length === 0) {
    void loadFolders(parentId);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="relative z-50 max-h-[80vh] w-[480px] overflow-hidden rounded-lg bg-neutral-900 shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <Breadcrumb
            items={parents}
            onNavigate={(id) => void loadFolders(id)}
          />
        </div>

        <div className="max-h-[40vh] overflow-y-auto p-4">
          <div className="grid gap-4">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className={`flex h-full cursor-pointer items-center rounded-lg p-3 transition-colors`}
                onClick={() => {
                  console.log(`Clicked Folder : ${folder.id}`);

                  if (folder.id === currentFolderId) return;
                  void loadFolders(folder.id);
                  setSelectedFolderId(folder.id);
                }}
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

        <div className="border-t border-gray-700 p-4">
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
