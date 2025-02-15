import { File, Folder, Image, Video } from "lucide-react";
import type {
  File as FileItem,
  Folder as FolderItem,
} from "../../lib/mock-data";
import type { files, folders } from "~/server/db/schema";

interface FileListProps {
  file: typeof files.$inferSelect;
  onFileClick?: (file: typeof files.$inferSelect) => void;
}

export function FileList({ file, onFileClick }: FileListProps) {
  const getIcon = (type: FileItem["type"]) => {
    switch (type) {
      case "doc":
        return <File className="h-6 w-6 text-blue-400" />;
      case "image":
        return <Image className="h-6 w-6 text-green-400" />;
      case "video":
        return <Video className="h-6 w-6 text-red-400" />;
    }
  };

  return (
    <div
      key={file.id}
      className="flex items-center rounded-lg bg-gray-800 p-4 shadow-md transition-shadow hover:shadow-lg"
    >
      {getIcon(
        file.type === "image"
          ? "image"
          : file.type === "video"
            ? "video"
            : "doc",
      )}
      <div className="ml-4 flex-grow">
        {
          <a
            href={file.url ?? ""}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium text-gray-100 hover:text-blue-400"
          >
            {file.name}
          </a>
        }
        <p className="text-sm text-gray-400">{file.size}</p>
      </div>
    </div>
  );
}

interface FolderListProps {
  folder: typeof folders.$inferSelect;
  onFolderClick: (folder: typeof folders.$inferSelect) => void;
}

export function FolderList({ folder, onFolderClick }: FolderListProps) {
  return (
    <div
      key={folder.id}
      className="flex items-center rounded-lg bg-gray-800 p-4 shadow-md transition-shadow hover:shadow-lg"
    >
      <Folder className="h-6 w-6 text-yellow-400" />
      <div className="ml-4 flex-grow">
        {
          <button
            onClick={() => onFolderClick(folder)}
            className="text-lg font-medium text-gray-100 hover:text-blue-400"
          >
            {folder.name}
          </button>
        }
      </div>
    </div>
  );
}
