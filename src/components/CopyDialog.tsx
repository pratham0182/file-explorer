"use client";
import React, { useState } from "react";
import { useFileSystem } from "../context/FileSystemContext";
import { Button } from "@mui/material";

export default function CopyDialog({
  srcId,
  onClose,
  onSuccess,
}: {
  srcId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const fs = useFileSystem();
  const folders = fs.listAllFolderIds();

  const [selectedFolderId, setSelectedFolderId] = useState<string>(fs.tree.id);
  const [typedPath, setTypedPath] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    let result;

    if (typedPath.trim()) {
      result = fs.copyByPath(srcId, typedPath.trim());
    } else {
      result = fs.copy(srcId, selectedFolderId);
    }

    if (!result.ok) setError(result.message ?? "Error");
    else onSuccess();
  };

  const pathFor = (p: string[]) =>
    p
      .map((id) => {
        const n = fs.findNode(id).node;
        return n ? n.name : id;
      })
      .join("/");

  return (
    <div className="modal">
      <div className="modal-body">
        <h3>Copy To</h3>

        <div
          style={{
            maxHeight: 300,
            overflow: "auto",
            border: "1px solid #eee",
            padding: 8,
          }}
        >
          {folders.map((f) => (
            <div key={f.id} style={{ padding: 6 }}>
              <label>
                <input
                  type="radio"
                  name="dest"
                  checked={selectedFolderId === f.id}
                  onChange={() => setSelectedFolderId(f.id)}
                />
                {pathFor(f.path)}
              </label>
            </div>
          ))}
        </div>

        {error && <div className="error">{error}</div>}

        <div style={{ marginTop: 12 }}>
          <Button variant="outlined" onClick={submit}>Copy</Button>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
