// types/fileTypes.ts
export type ID = string;

export type BaseNode = {
  id: ID;
  name: string;
  type: "file" | "folder";
};

export type FileNode = BaseNode & { type: "file" };
export type FolderNode = BaseNode & { type: "folder"; children: FileSystemNode[] };

export type FileSystemNode = FileNode | FolderNode;
export type FileTree = FolderNode;

export type PathArray = ID[]; // path as array of ids (root id first)
