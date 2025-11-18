"use client";

import { useState } from "react";
import { FolderNode, PathArray } from "../types/fileTypes";
import FileItem from "./FileItem";

interface Props {
  node: FolderNode;
  basePath: PathArray;
  renderChildren: {
    onRename: (p: PathArray) => void;
    onCopy: (p: PathArray) => void;
    onMove: (p: PathArray) => void;
  };
}

export default function Folder({ node, basePath, renderChildren }: Props) {
  const [open, setOpen] = useState(true);
  const path = [...basePath, node.name];

  return (
    <div style={{ marginLeft: 20 }}>
      <div style={{ cursor: "pointer" }} onClick={() => setOpen(!open)}>
        {open ? "📂" : "📁"} {node.name}
      </div>

      {open &&
        node.children.map((child) =>
          child.type === "folder" ? (
            <Folder
              key={child.name}
              node={child}
              basePath={path}
              renderChildren={renderChildren}
            />
          ) : (
            <FileItem
              key={child.name}
              node={child}
              path={[...path, child.name]}
              {...renderChildren}
            />
          )
        )}
    </div>
  );
}
