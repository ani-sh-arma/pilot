import {
  File,
  Folder,
  Image,
  Video,
  Music,
  FileText,
  MoreVertical,
} from "lucide-react";
import type { File as FileItem } from "../../lib/mock-data";
import type { file_table, folder_table } from "~/server/db/schema";
import Link from "next/link";

interface FileListProps {
  file: typeof file_table.$inferSelect;
}

export function FileList({ file }: FileListProps) {
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

  return (
    <div
      key={file.id}
      className="flex items-center rounded-lg bg-gray-800 p-4 shadow-md transition-shadow hover:shadow-lg"
    >
      {getIcon(file.type ?? "file")}
      <div className="ml-4 flex-grow">
        {
          <a
            href={file.url ?? ""}
            target="_blank"
            rel="noopener noreferrer"
            className="text-md font-medium text-gray-100 hover:text-blue-400"
          >
            {file.name}
          </a>
        }
      </div>
      <p className="text-sm text-gray-400">{`${parseInt(file.size ?? "0") / 1000} KB`}</p>
      <button className="ml-4 p-1 hover:text-gray-300">
        <MoreVertical className="h-5 w-5" />
      </button>
    </div>
  );
}

interface FolderListProps {
  folder: typeof folder_table.$inferSelect;
}

export function FolderList({ folder }: FolderListProps) {
  return (
    <Link
      href={`/f/${folder.id}`}
      className="text-lg font-medium text-gray-100 hover:text-blue-400"
    >
      {
        <div
          key={folder.id}
          className="flex items-center rounded-lg bg-gray-800 p-4 shadow-md transition-shadow hover:shadow-lg"
        >
          <Folder className="h-6 w-6 text-yellow-400" />
          <div className="ml-4 flex-grow">{folder.name}</div>
          <button
            className="ml-4 p-1 hover:text-gray-300"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      }
    </Link>
  );
}
