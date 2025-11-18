// components/MoveDialog.tsx
"use client";
import React, { useState } from "react";
import { useFileSystem } from "../context/FileSystemContext";
import { Button } from "@mui/material";

export default function MoveDialog({ srcId, onClose, onSuccess }: { srcId: string; onClose: () => void; onSuccess: () => void; }) {
  const fs = useFileSystem();
  const folders = fs.listAllFolderIds();
  const [selectedFolderId, setSelectedFolderId] = useState<string>(fs.tree.id);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const res = fs.move(srcId, selectedFolderId);
    if (!res.ok) setError(res.message ?? "Error");
    else onSuccess();
  };

  const pathFor = (p: string[]) => p.map(id => {
    const n = fs.findNode(id).node;
    return n ? n.name : id;
  }).join("/");

  return (
    <div className="modal">
      <div className="modal-body">
        <h3>Move To</h3>
        <div style={{ maxHeight: 300, overflow: "auto", border: "1px solid #eee", padding: 8 }}>
          {folders.map(f => (
            <div key={f.id} style={{ padding: 6 }}>
              <label>
                <input type="radio" name="dest" checked={selectedFolderId === f.id} onChange={() => setSelectedFolderId(f.id)} />
                {pathFor(f.path)}
              </label>
            </div>
          ))}
        </div>
        {error && <div className="error">{error}</div>}
        <div style={{ marginTop: 12 }}>
          <Button variant="outlined" onClick={submit}>Move</Button>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
