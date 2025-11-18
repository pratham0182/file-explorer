"use client";
import React, { useState } from "react";
import { useFileSystem } from "../context/FileSystemContext";
import { Button } from "@mui/material";

export default function RenameDialog({ id, onClose, onSuccess }: { id: string; onClose: () => void; onSuccess: () => void; }) {
  const fs = useFileSystem();
  const { node } = fs.findNode(id);
  const [value, setValue] = useState(node?.name ?? "");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const res = fs.rename(id, value);
    if (!res.ok) setError(res.message ?? "Error");
    else { onSuccess(); }
  };

  return (
    <div className="modal">
      <div className="modal-body">
        <h3>Rename</h3>
        <div>Current: <b>{node?.name}</b></div>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <div style={{ marginTop: 12 }}>
          <Button variant="outlined" onClick={submit}>Save</Button>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
