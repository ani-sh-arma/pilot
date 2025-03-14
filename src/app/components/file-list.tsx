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
import type { file_table, folder_table } from "~/server/db/schema";
import {
  convertToPdfAction,
  deleteFileAction,
} from "~/server/actions/file-actions";
import { useRouter } from "next/navigation";
import ShareButton from "./share-button";
import { MoveModal } from "./move-modal";
import { moveFileToFolder } from "~/server/actions/move-actions";
import toast from "react-hot-toast";
import { getErrorMessage } from "~/lib/utils/error-handling";

interface FileListProps {
  file: typeof file_table.$inferSelect;
  parent: typeof folder_table.$inferSelect;
}

export function FileList({ file, parent }: FileListProps) {
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
    const deletePromise = (async () => {
      try {
        setIsDeleting(true);
        await deleteFileAction(file.id, file.fileKey ?? "");
        navigate.refresh();
        return "File deleted successfully";
      } catch (error) {
        throw new Error(getErrorMessage(error));
      } finally {
        setIsDeleting(false);
        setShowMenu(false);
      }
    })();

    await toast.promise(deletePromise, {
      loading: "Deleting file...",
      success: (message) => message,
      error: (error) => getErrorMessage(error),
    });
  };

  const handleDownload = async () => {
    if (!file.url) return;

    const downloadPromise = (async () => {
      try {
        setIsDeleting(true);
        const response = await fetch(file.url ?? "");
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = file.name ?? "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        return "File downloaded successfully";
      } catch (error) {
        throw new Error(getErrorMessage(error));
      } finally {
        setIsDeleting(false);
        setShowMenu(false);
      }
    })();

    await toast.promise(downloadPromise, {
      loading: "Downloading file...",
      success: (message) => message,
      error: (error) => getErrorMessage(error),
    });
  };

  const handleDownloadAsPdf = async () => {
    if (!file.url) return;

    const downloadAsPdfPromise = (async () => {
      try {
        const fileType =
          file.name?.split(".")[file.name?.split(".").length - 1];
        setIsDeleting(true);
        const base64Pdf = await convertToPdfAction(
          file.url ?? "",
          fileType === "pdf" || fileType === "PDF" ? "pdf" : (file.type ?? ""),
        );

        if (base64Pdf.startsWith("https://")) {
          handleDownload();
          return;
        }

        // Convert base64 to blob
        const binaryStr = window.atob(base64Pdf);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "application/pdf" });

        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${file.name?.split(".")[0] ?? "download"}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        return "File downloaded as PDF successfully";
      } catch (error) {
        throw new Error(getErrorMessage(error));
      } finally {
        setIsDeleting(false);
        setShowMenu(false);
      }
    })();

    await toast.promise(downloadAsPdfPromise, {
      loading: "Converting and downloading as PDF...",
      success: (message) => message ?? "",
      error: (error) => getErrorMessage(error),
    });
  };

  const handleMove = async (newParentId: bigint) => {
    const movePromise = (async () => {
      try {
        await moveFileToFolder(file.id, newParentId);
        setIsModalOpen(false);
        setShowMenu(false);
        navigate.refresh();

        return "File moved successfully";
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    })();

    await toast.promise(movePromise, {
      loading: "Moving file...",
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
          currentFolderId={file.parentId}
          currentFileOrFolder={file.name ?? ""}
          title={`Move "${file.name}" to: ${parent.name}`}
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
                  Loading...
                </div>
              ) : (
                <>
                  <ShareButton
                    title={file.name ?? ""}
                    text={""}
                    url={file.url ?? ""}
                  />
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </button>
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                    onClick={handleDownloadAsPdf}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download as PDF
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
