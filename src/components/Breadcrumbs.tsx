// components/Breadcrumbs.tsx
"use client";
import React from "react";
import { useFileSystem } from "../context/FileSystemContext";

export default function Breadcrumbs({ pathIds, onClickId }: { pathIds: string[]; onClickId: (id: string) => void; }) {
  const fs = useFileSystem();
  const names = pathIds.map(id => ({ id, name: fs.findNode(id).node?.name ?? "?" }));

  return (
    <div style={{ marginBottom: 8 }}>
      {names.map((p, i) => (
        <span key={p.id}>
          <button onClick={() => onClickId(p.id)} style={{ background: "none", border: "none", color: "#0645AD", cursor: "pointer" }}>
            {p.name}
          </button>
          {i < names.length - 1 && " / "}
        </span>
      ))}
    </div>
  );
}
