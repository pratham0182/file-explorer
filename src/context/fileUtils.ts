import { FileTree, FileSystemNode, FolderNode, PathArray, ID } from "../types/fileTypes";

export function genId(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

export function injectIds(node: any, idPrefix = ""): FileSystemNode {
  const id: ID = genId(idPrefix);
  if (node.type === "file") {
    return { id, name: node.name, type: "file" };
  } else {
    const folder: FolderNode = { id, name: node.name, type: "folder", children: [] };
    folder.children = (node.children || []).map((c: any) => injectIds(c, id));
    return folder;
  }
}

export function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

export function findNodeById(root: FileTree, id: ID) {
  if (root.id === id) return { node: root, parent: null as FolderNode | null };
  const stack: { node: FileSystemNode; parent: FolderNode | null }[] = [{ node: root, parent: null }];
  while (stack.length) {
    const { node, parent } = stack.pop()!;
    if (node.id === id) return { node, parent };
    if (node.type === "folder") {
      for (const child of node.children) stack.push({ node: child, parent: node });
    }
  }
  return { node: null, parent: null };
}

export function getPathById(root: FileTree, targetId: ID): PathArray | null {
  const path: ID[] = [];
  let found = false;
  function dfs(node: FileSystemNode): void {
    if (found) return;
    path.push(node.id);
    if (node.id === targetId) { found = true; return; }
    if (node.type === "folder") {
      for (const c of node.children) {
        dfs(c);
        if (found) return;
      }
    }
    path.pop();
  }
  dfs(root);
  return found ? path : null;
}

export function isDescendant(root: FileTree, nodeId: ID, targetId: ID) {
  const path = getPathById(root, targetId);
  if (!path) return false;
  return path.includes(nodeId);
}

export function renameNode(root: FileTree, targetId: ID, newName: string) {
  const tree = deepClone(root);
  const { node } = findNodeById(tree, targetId);
  if (!node) throw new Error("Node not found");
  node.name = newName;
  return tree;
}

export function insertNodeAt(root: FileTree, destFolderId: ID, nodeToInsert: FileSystemNode) {
  const tree = deepClone(root);
  const { node } = findNodeById(tree, destFolderId);
  if (!node || node.type !== "folder") throw new Error("Destination folder not found");
  node.children.push(nodeToInsert);
  return tree;
}

export function removeNodeById(root: FileTree, targetId: ID) {
  const tree = deepClone(root);
  if (tree.id === targetId) throw new Error("Cannot remove root");
  const parent = findParent(tree, targetId);
  if (!parent) throw new Error("Parent not found");
  const idx = parent.children.findIndex(c => c.id === targetId);
  const removed = parent.children.splice(idx, 1)[0];
  return { newTree: tree, removedNode: removed, parentId: parent.id };
}

export function findParent(root: FileTree, targetId: ID): FolderNode | null {
  if (root.id === targetId) return null;
  const stack: FileSystemNode[] = [root];
  while (stack.length) {
    const node = stack.pop()!;
    if (node.type === "folder") {
      for (const child of node.children) {
        if (child.id === targetId) return node;
        if (child.type === "folder") stack.push(child);
      }
    }
  }
  return null;
}
