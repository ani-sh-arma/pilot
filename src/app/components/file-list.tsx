import {
  File,
  Image,
  Video,
  Music,
  FileText,
  MoreVertical,
  Trash,
  Download,
  Loader2,
  Move,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { file_table } from "~/server/db/schema";
import { deleteFileAction } from "~/server/actions/file-actions";
import { useRouter } from "next/navigation";
import ShareButton from "./share-button";
import { MoveModal } from "./move-modal";

interface FileListProps {
  file: typeof file_table.$inferSelect;
}

export function FileList({ file }: FileListProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useRouter();

  console.log(`File Size : ${file.size}`);

  let fileSize = parseInt(file.size ?? "0");
  let sizeUnit = "B";
  if (fileSize > 1024 && fileSize < 1024 * 1024) {
    fileSize = fileSize / 1024;
    sizeUnit = "KB";
  } else if (fileSize > 1024 * 1024) {
    fileSize = fileSize / 1024 / 1024;
    sizeUnit = "MB";
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "doc":
        return <FileText className="h-6 w-6 text-blue-400" />;
      case "image":
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        return <Image className="h-6 w-6 text-green-400" />;
      case "video":
        return <Video className="h-6 w-6 text-red-400" />;
      case "audio":
        return <Music className="h-6 w-6 text-purple-400" />;
      default:
        return <File className="h-6 w-6 text-gray-400" />;
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteFileAction(file.id, file.fileKey ?? "");
      navigate.refresh();
    } catch (error) {
      setIsDeleting(false);
      alert(error instanceof Error ? error.message : "Failed to delete file");
    }
  };

  return (
    <>
      {isModalOpen && (
        <MoveModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onMove={async (folderId: bigint) => {}}
          currentFolderId={file.parentId}
          title={`Move "${file.name}" to:`}
          parentId={file.parentId}
        />
      )}
      <div
        key={file.id}
        className="relative flex items-center rounded-lg bg-gray-800 p-4 shadow-md transition-shadow hover:shadow-lg"
      >
        {getIcon(file.type ?? "file")}
        <div className="ml-4 flex-grow">
          <a
            href={file.url ?? ""}
            target="_blank"
            rel="noopener noreferrer"
            className="text-md font-medium text-gray-100 hover:text-blue-400"
          >
            {file.name}
          </a>
        </div>
        <p className="text-sm text-gray-400">{`${fileSize.toFixed(2)} ${sizeUnit}`}</p>
        <div className="relative" ref={menuRef}>
          <button
            className="ml-4 p-1 hover:text-gray-300"
            onClick={() => setShowMenu(!showMenu)}
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
                  <ShareButton
                    title={file.name ?? ""}
                    text={""}
                    url={file.url ?? ""}
                  />
                  <button className="flex w-full items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">
                    <Download className="mr-2 h-4 w-4" />
                    Download
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
                    onClick={handleDelete}
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
