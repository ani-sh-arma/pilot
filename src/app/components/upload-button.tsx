import { Upload } from "lucide-react"

export function UploadButton() {
  const handleUpload = () => {
    alert("Upload functionality would be implemented here")
  }

  return (
    <button
      onClick={handleUpload}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Upload className="w-5 h-5 mr-2" />
      Upload
    </button>
  )
}

