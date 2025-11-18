// components/DetailsPanel.tsx
"use client";
import React from "react";
import { useFileSystem } from "../context/FileSystemContext";
import { Button } from "@mui/material";

export default function DetailsPanel({
  selectedId,
  onRename,
  onMove,
  onCopyPath,
}: {
  selectedId: string | null;
  onRename: () => void;
  onMove: () => void;
  onCopyPath: (path: string) => void;
}) {
  const fs = useFileSystem();
  if (!selectedId) return <div>Nothing selected</div>;
  const { node } = fs.findNode(selectedId);
  const pathIds = fs.getPath(selectedId) ?? [];
  const names = pathIds.map(id => {
    const r = fs.findNode(id);
    return r.node ? r.node.name : "";
  });
  const fullPath = names.join("/");

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
      <h3>Details</h3>
      <div><b>Name:</b> {node?.name}</div>
      <div><b>Type:</b> {node?.type}</div>
      <div style={{ marginTop: 8 }}><b>Full path:</b> {fullPath}</div>
      <div style={{ marginTop: 12 }}>
        <Button variant="outlined" onClick={onRename}>Rename</Button>
        <Button variant="outlined" onClick={onMove}>Move</Button>
        <Button variant="outlined" onClick={() => {
          navigator.clipboard.writeText(fullPath).then(() => {
            onCopyPath(fullPath);
          });
        }}>Copy Path</Button>
      </div>
    </div>
  );
}
