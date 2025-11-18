// components/FileExplorer.tsx
"use client";
import React, { useMemo, useState } from "react";
import { useFileSystem } from "../context/FileSystemContext";
import FolderView from "./FolderView";
import RenameDialog from "./RenameDialog";
import MoveDialog from "./MoveDialog";
import DetailsPanel from "./DetailsPanel";
import Breadcrumbs from "./Breadcrumbs";
import SearchBox from "./SearchBox";
import CopyDialog from "./CopyDialog";

export default function FileExplorer() {
  const fs = useFileSystem();
  const [selectedId, setSelectedId] = useState<string | null>(fs.tree.id);
  const [renameOpen, setRenameOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [copyOpen, setCopyOpen] = useState(false);
  const onCopyStart = (id: string) => {
    setSelectedId(id);
    setCopyOpen(true);
  };

  // 🔍 NEW SEARCH LOGIC (trigger only after 3 characters)
  const { matchedIds, autoExpanded } = useMemo(() => {
    const trimmed = query.trim();

    // Only search after 3 characters
    if (trimmed.length < 3) {
      return {
        matchedIds: new Set<string>(),
        autoExpanded: new Set<string>(),
      };
    }

    const q = trimmed.toLowerCase();
    const matched = new Set<string>();
    const expanded = new Set<string>();

    function dfs(node: any, chain: string[]) {
      const selfMatch = node.name.toLowerCase().includes(q);

      let matchFound = false;

      if (selfMatch) {
        matched.add(node.id);

        // Expand only this node’s ancestors
        chain.forEach((id) => expanded.add(id));

        matchFound = true;
      }

      if (node.type === "folder") {
        for (const child of node.children) {
          const childMatch = dfs(child, [...chain, node.id]);
          if (childMatch) matchFound = true;
        }
      }

      return matchFound;
    }

    dfs(fs.tree, []);

    return { matchedIds: matched, autoExpanded: expanded };
  }, [query, fs.tree]);

  // Select items
  const select = (id: string) => {
    setSelectedId(id);
  };

  // Toast messages
  const showMessage = (m: string) => {
    setLastMessage(m);
    setTimeout(() => setLastMessage(null), 2000);
  };

  const onRenameStart = (id: string) => {
    setSelectedId(id);
    setRenameOpen(true);
  };

  const onMoveStart = (id: string) => {
    setSelectedId(id);
    setMoveOpen(true);
  };

  // Selected path for breadcrumbs
  const selectedPath = selectedId ? fs.getPath(selectedId) : null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
      {/* LEFT SIDE */}
      <div>
        {/* Title + Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>File Explorer</h2>
          <SearchBox value={query} onChange={setQuery} />
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs
          pathIds={selectedPath ?? [fs.tree.id]}
          onClickId={select}
        />

        {/* Tree */}
        <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
          <FolderView
            node={fs.tree}
            basePath={[]}
            onSelect={select}
            selectedId={selectedId}
            matchedIds={matchedIds}
            autoExpanded={autoExpanded}
            onRename={onRenameStart}
            onCopy={onCopyStart}
            onMove={onMoveStart}
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <aside>
        <DetailsPanel
          selectedId={selectedId}
          onRename={() => selectedId && onRenameStart(selectedId)}
          onMove={() => selectedId && onMoveStart(selectedId)}
          onCopyPath={(p) => showMessage("Path copied!")}
        />
        {lastMessage && <div className="toast">{lastMessage}</div>}
      </aside>

      {/* Rename Dialog */}
      {renameOpen && selectedId && (
        <RenameDialog
          id={selectedId}
          onClose={() => setRenameOpen(false)}
          onSuccess={() => {
            setRenameOpen(false);
            showMessage("Renamed");
          }}
        />
      )}

      {/* Move Dialog */}
      {moveOpen && selectedId && (
        <MoveDialog
          srcId={selectedId}
          onClose={() => setMoveOpen(false)}
          onSuccess={() => {
            setMoveOpen(false);
            showMessage("Moved");
          }}
        />
      )}
      {copyOpen && selectedId && (
        <CopyDialog
          srcId={selectedId}
          onClose={() => setCopyOpen(false)}
          onSuccess={() => {
            setCopyOpen(false);
            showMessage("Copied");
          }}
        />
      )}
    </div>
  );
}
