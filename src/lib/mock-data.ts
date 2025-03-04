export type FileType = "file" | "doc" | "image" | "video" | "audio";

export interface File {
  id: string;
  name: string;
  type: FileType;
  parentId: string;
  url: string;
  size: string;
}

export const imageTypes = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
export const videoTypes = [
  "mp4",
  "mov",
  "avi",
  "mkv",
  "flv",
  "wmv",
  "m4v",
  "webm",
  "ogg",
  "ogv",
  "mpeg",
  "mpg",
  "mpeg4",
  "3gp",
  "3gpp",
  "3g2",
  "3gpp2",
  "m2ts",
  "ts",
  "mts",
  "webm",
  "vob",
  "m4p",
];
export const audioTypes = [
  "mp3",
  "wav",
  "ogg",
  "wma",
  "aac",
  "flac",
  "ape",
  "m4a",
  "m4b",
  "m4r",
  "m4a",
];
export const docTypes = [
  "txt",
  "doc",
  "docx",
  "pdf",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "csv",
  "rtf",
  "odt",
  "ods",
  "odp",
  "odg",
  "md",
  "html",
];

export type Folder = {
  id: string;
  name: string;
  type: "folder";
  parentId: string | null;
};

export const mockFolders: Folder[] = [
  { id: "root", name: "Home", type: "folder", parentId: null },
  { id: "1", name: "Documents", type: "folder", parentId: "root" },
  { id: "2", name: "Work", type: "folder", parentId: "root" },
  { id: "3", name: "Family", type: "folder", parentId: "root" },
  { id: "4", name: "Videos", type: "folder", parentId: "3" },
];

export const mockFiles: File[] = [
  {
    id: "5",
    name: "Report.docx",
    type: "doc",
    parentId: "root",
    url: "/files/report.docx",
    size: "2.5 MB",
  },
  {
    id: "6",
    name: "Budget.xlsx",
    type: "doc",
    parentId: "2",
    url: "/files/budget.xlsx",
    size: "1.8 MB",
  },
  {
    id: "7",
    name: "Vacation.jpg",
    type: "image",
    parentId: "3",
    url: "/files/vacation.jpg",
    size: "3.2 MB",
  },
  {
    id: "8",
    name: "Family.jpg",
    type: "image",
    parentId: "3",
    url: "/files/family.jpg",
    size: "2.9 MB",
  },
  {
    id: "9",
    name: "Tutorial.mp4",
    type: "video",
    parentId: "4",
    url: "/files/tutorial.mp4",
    size: "450 MB",
  },
];
