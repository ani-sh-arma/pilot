import { File, Folder, Image, Video } from "lucide-react"
import type { FileItem } from "../../lib/mock-data"

interface FileListProps {
  files: FileItem[]
  onFolderClick: (folder: FileItem) => void
}

export function FileList({ files, onFolderClick }: FileListProps) {
  const getIcon = (type: FileItem["type"]) => {
    switch (type) {
      case "folder":
        return <Folder className="w-6 h-6 text-yellow-400" />
      case "document":
        return <File className="w-6 h-6 text-blue-400" />
      case "image":
        return <Image className="w-6 h-6 text-green-400" />
      case "video":
        return <Video className="w-6 h-6 text-red-400" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          {getIcon(file.type)}
          <div className="ml-4 flex-grow">
            {file.type === "folder" ? (
              <button
                onClick={() => onFolderClick(file)}
                className="text-lg font-medium text-gray-100 hover:text-blue-400"
              >
                {file.name}
              </button>
            ) : (
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-gray-100 hover:text-blue-400"
              >
                {file.name}
              </a>
            )}
            <p className="text-sm text-gray-400">{file.size}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

