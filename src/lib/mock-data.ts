export interface File {
  id: string
  name: string
  type: "doc" | "image" | "video"
  parentId: string
  url: string
  size: string
}

export type Folder = {
  id: string
  name: string
  type: "folder"
  parentId: string | null
}

export const mockFolders: Folder[] = [
  { id: "root", name: "Home", type: "folder", parentId: null },
  { id: "1", name: "Documents", type: "folder", parentId: "root" },
  { id: "2", name: "Work", type: "folder", parentId: "root" },
  { id: "3", name: "Family", type: "folder", parentId: "root" },
  { id: "4", name: "Videos", type: "folder", parentId: "3" },
]

export const mockFiles: File[] = [
  { id: "5", name: "Report.docx", type: "doc", parentId: "2", url: "/files/report.docx", size: "2.5 MB" },
  { id: "6", name: "Budget.xlsx", type: "doc", parentId: "2", url: "/files/budget.xlsx", size: "1.8 MB" },
  { id: "7", name: "Vacation.jpg", type: "image", parentId: "3", url: "/files/vacation.jpg", size: "3.2 MB" },
  { id: "8", name: "Family.jpg", type: "image", parentId: "3", url: "/files/family.jpg", size: "2.9 MB" },
  { id: "9", name: "Tutorial.mp4", type: "video", parentId: "4", url: "/files/tutorial.mp4", size: "450 MB" },
]

