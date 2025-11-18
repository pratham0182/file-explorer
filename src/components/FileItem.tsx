"use client";

import { FileNode, PathArray } from "../types/fileTypes";
import { Button } from "@mui/material";

interface Props {
  node: FileNode;
  path: PathArray;
  onRename: (p: PathArray) => void;
  onCopy: (p: PathArray) => void;
  onMove: (p: PathArray) => void;
}

export default function FileItem({ node, path, onRename, onCopy, onMove }: Props) {
  return (
    <div style={{ padding: 6, marginLeft: 30 }}>
      📄 {node.name}
      <Button sx={{ width: 100, height: 20, fontSize: '0.8rem' }} variant="outlined" onClick={() => onRename(path)}>Rename</Button>
      <Button sx={{ width: 100, height: 20, fontSize: '0.8rem' }} variant="outlined" onClick={() => onCopy(path)}>Copy</Button>
      <Button sx={{ width: 100, height: 20, fontSize: '0.8rem' }} variant="outlined" onClick={() => onMove(path)}>Move</Button>
    </div>
  );
}
