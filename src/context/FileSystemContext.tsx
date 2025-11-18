"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import initialRaw from "../data/files";
import { injectIds, getPathById, findNodeById, renameNode, insertNodeAt, removeNodeById, isDescendant } from "./fileUtils";
import { FileTree, FileSystemNode, ID, PathArray } from "../types/fileTypes";

type FSState = { tree: FileTree };

type Action =
  | { type: "SET"; payload: FileTree }
  | { type: "RENAME"; payload: { id: ID; newName: string } }
  | { type: "COPY"; payload: { srcId: ID; destFolderId: ID } }
  | { type: "MOVE"; payload: { srcId: ID; destFolderId: ID } };

type FSContextType = {
  tree: FileTree;
  rename: (id: ID, newName: string) => { ok: boolean; message?: string };
  copy: (srcId: ID, destFolderId: ID) => { ok: boolean; message?: string };
  move: (srcId: ID, destFolderId: ID) => { ok: boolean; message?: string };
  getPath: (id: ID) => PathArray | null;
  findNode: (id: ID) => { node: FileSystemNode | null; parentId: ID | null };
  listAllFolderIds: () => { id: ID; path: PathArray; name: string }[];
  copyByPath?:any
};

const initialTreeWithIds = injectIds(initialRaw) as FileTree;

const reducer = (state: FileTree, action: Action): FileTree => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "RENAME":
      return renameNode(state, action.payload.id, action.payload.newName) as FileTree;
    case "COPY": {
      const { node } = findNodeById(state, action.payload.srcId);
      if (!node) return state;
      const cloned = JSON.parse(JSON.stringify(node));
      return insertNodeAt(state, action.payload.destFolderId, cloned) as FileTree;
    }
    case "MOVE": {
      const { newTree, removedNode } = removeNodeById(state, action.payload.srcId);
      return insertNodeAt(newTree, action.payload.destFolderId, removedNode) as FileTree;
    }
    default:
      return state;
  }
};

const FileSystemContext = createContext<FSContextType | null>(null);

export function FileSystemProvider({ children }: { children: React.ReactNode }) {
  const [tree, dispatch] = useReducer(reducer, initialTreeWithIds);

  useEffect(() => {
    const s = localStorage.getItem("fileTree_v2");
    if (s) {
      try {
        const parsed = JSON.parse(s);
        dispatch({ type: "SET", payload: parsed });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("fileTree_v2", JSON.stringify(tree));
  }, [tree]);

  const getPath = (id: ID) => getPathById(tree, id);

  const findNode = (id: ID) => {
    const r = findNodeById(tree, id);
    const parent = r.parent ? r.parent.id : null;
    return { node: r.node, parentId: parent };
  };

  const listAllFolderIds = () => {
    const out: { id: ID; path: PathArray; name: string }[] = [];
    function dfs(node: FileSystemNode, path: PathArray) {
      if (node.type === "folder") {
        out.push({ id: node.id, path: [...path, node.id], name: node.name });
        node.children.forEach((c) => dfs(c, [...path, node.id]));
      }
    }
    dfs(tree, []);
    return out;
  };

  const rename = (id: ID, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return { ok: false, message: "Name cannot be empty or whitespace." };

    const parent = ((): any => {
      const p = (tree.id === id) ? null : findParentSync(tree, id);
      return p;
    })();

    const siblings = parent ? parent.children : [tree];
    const duplicate = siblings.some((s: any) => s.id !== id && s.name.toLowerCase() === trimmed.toLowerCase());
    if (duplicate) return { ok: false, message: "Name cannot duplicate a sibling’s name (case-insensitive)." };

    dispatch({ type: "RENAME", payload: { id, newName: trimmed } });
    return { ok: true };
  };

  const copy = (srcId: ID, destFolderId: ID) => {
    const dest = findNodeById(tree, destFolderId).node;
    if (!dest || dest.type !== "folder") return { ok: false, message: "Destination must be a folder." };
    dispatch({ type: "COPY", payload: { srcId, destFolderId } });
    return { ok: true };
  };

  const move = (srcId: ID, destFolderId: ID) => {
    const src = findNodeById(tree, srcId).node;
    if (!src) return { ok: false, message: "Source not found." };

    const dest = findNodeById(tree, destFolderId).node;
    if (!dest || dest.type !== "folder") return { ok: false, message: "Destination must be a folder." };

    if (tree.id === srcId) return { ok: false, message: "Cannot move root." };

    const parent = findParentSync(tree, srcId);
    if (parent && parent.id === destFolderId) return { ok: false, message: "Item is already in the selected folder." };

    if (isDescendant(tree, srcId, destFolderId)) return { ok: false, message: "Cannot move a folder into itself or any of its descendants." };

    dispatch({ type: "MOVE", payload: { srcId, destFolderId } });
    return { ok: true };
  };

  return (
    <FileSystemContext.Provider
      value={{
        tree,
        rename,
        copy,
        move,
        getPath,
        findNode,
        listAllFolderIds,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFileSystem() {
  const c = useContext(FileSystemContext);
  if (!c) throw new Error("useFileSystem must be used inside FileSystemProvider");
  return c;
}

function findParentSync(root: FileTree, targetId: ID) {
  if (root.id === targetId) return null;
  const stack: any[] = [{ node: root, parent: null as any }];
  while (stack.length) {
    const { node, parent } = stack.pop()!;
    if (node.id === targetId) return parent;
    if (node.type === "folder") {
      for (const child of node.children) stack.push({ node: child, parent: node });
    }
  }
  return null;
}


