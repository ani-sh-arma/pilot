import {
  File,
  Folder,
  Image,
  Video,
  Music,
  FileText,
  MoreVertical,
  Share,
  Trash,
  Download,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { file_table, folder_table } from "~/server/db/schema";
import Link from "next/link";
import { deleteFileAction } from "~/server/actions/file-actions";

interface FileListProps {
  file: typeof file_table.$inferSelect;
}

export function FileList({ file }: FileListProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
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
      <p className="text-sm text-gray-400">{`${parseInt(file.size ?? "0") / 1000} KB`}</p>
      <div className="relative" ref={menuRef}>
        <button
          className="ml-4 p-1 hover:text-gray-300"
          onClick={() => setShowMenu(!showMenu)}
        >
          <MoreVertical className="h-5 w-5" />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-10 z-50 w-48 rounded-md bg-gray-700 py-1 shadow-lg">
            <button className="flex w-full items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">
              <Share className="mr-2 h-4 w-4" />
              Share
            </button>
            <button className="flex w-full items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">
              <Download className="mr-2 h-4 w-4" />
              Download
            </button>
            <button
              className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
              onClick={() =>
                deleteFileAction(file.id, file.ownerId).then(() =>
                  window.location.reload(),
                )
              }
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface FolderListProps {
  folder: typeof folder_table.$inferSelect;
}

export function FolderList({ folder }: FolderListProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Link
      href={`/f/${folder.id}`}
      className="text-lg font-medium text-gray-100 hover:text-blue-400"
    >
      <div
        key={folder.id}
        className="relative flex items-center rounded-lg bg-gray-800 p-4 shadow-md transition-shadow hover:shadow-lg"
      >
        <Folder className="h-6 w-6 text-yellow-400" />
        <div className="ml-4 flex-grow">{folder.name}</div>
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
              <button className="flex w-full items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">
                <Share className="mr-2 h-4 w-4" />
                Share
              </button>
              <button className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-600">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
