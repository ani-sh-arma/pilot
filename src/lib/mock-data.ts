export type FileType = "folder" | "document" | "image" | "video"

export interface FileItem {
  id: string
  name: string
  type: FileType
  parentId: string | null
  url?: string
  size: string
}

export const mockFiles: FileItem[] = [
  { id: "1", name: "Root", type: "folder", parentId: null, size: "1.2 GB" },
  { id: "2", name: "Documents", type: "folder", parentId: "1", size: "250 MB" },
  { id: "3", name: "Images", type: "folder", parentId: "1", size: "500 MB" },
  { id: "4", name: "Videos", type: "folder", parentId: "1", size: "450 MB" },
  { id: "5", name: "Report.docx", type: "document", parentId: "2", url: "/files/report.docx", size: "2.5 MB" },
  { id: "6", name: "Budget.xlsx", type: "document", parentId: "2", url: "/files/budget.xlsx", size: "1.8 MB" },
  { id: "7", name: "Vacation.jpg", type: "image", parentId: "3", url: "/files/vacation.jpg", size: "3.2 MB" },
  { id: "8", name: "Family.jpg", type: "image", parentId: "3", url: "/files/family.jpg", size: "2.9 MB" },
  { id: "9", name: "Tutorial.mp4", type: "video", parentId: "4", url: "/files/tutorial.mp4", size: "450 MB" },
]

