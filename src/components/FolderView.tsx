// components/FolderView.tsx
"use client";
import React, { useEffect, useState } from "react";
import { FolderNode } from "../types/fileTypes";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ActionMenu from "./ActionMenu";

interface Props {
  node: FolderNode;
  basePath: string[];
  onSelect: (id: string) => void;
  selectedId: string | null;
  matchedIds: Set<string>;
  autoExpanded: Set<string>;
  onRename: (id: string) => void;
  onCopy: (id: string) => void;
  onMove: (id: string) => void;
}

export default function FolderView({
  node,
  onSelect,
  selectedId,
  matchedIds,
  autoExpanded,
  onRename,
  onCopy,
  onMove,
}: Props) {

  const [open, setOpen] = useState(node.id === "root");

  const isSearching = matchedIds.size > 0;


  useEffect(() => {
    if (isSearching) {
      if (autoExpanded.has(node.id)) {
        setOpen(true);
      } else if (node.id !== "root") {
        setOpen(false);
      }
      return;
    }


    if (!isSearching) {
      if (node.id === "root") setOpen(true);
      else setOpen(false);
    }
  }, [isSearching, autoExpanded, node.id]);

  const shouldOpen = open;

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const closeMenu = () => setMenuAnchor(null);

  return (
    <div style={{ marginLeft: 8, lineHeight: "35px" }}>

      <div
        className={`tree-item ${selectedId === node.id ? "selected" : ""}`}
        onClick={() => onSelect(node.id)}
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          style={{ cursor: "pointer", marginRight: 8 }}
        >
          {shouldOpen ? "📂" : "📁"}
        </span>

        <strong>{node.name}</strong>

        <span style={{ marginLeft: "auto" }}>
          <Tooltip title="Actions">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setMenuAnchor(e.currentTarget);
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
            <MenuItem
              onClick={() => {
                closeMenu();
                onRename(node.id);
              }}
            >
              Rename
            </MenuItem>

            <MenuItem
              onClick={() => {
                closeMenu();
                onCopy(node.id);
              }}
            >
              Copy
            </MenuItem>

            <MenuItem
              onClick={() => {
                closeMenu();
                onMove(node.id);
              }}
            >
              Move
            </MenuItem>
          </Menu>
        </span>
      </div>

      {shouldOpen && (
        <div style={{ marginLeft: 18 }}>
          {node.children.map((child) =>
            child.type === "folder" ? (
              <FolderView
                key={child.id}
                node={child}
                basePath={[]}
                onSelect={onSelect}
                selectedId={selectedId}
                matchedIds={matchedIds}
                autoExpanded={autoExpanded}
                onRename={onRename}
                onCopy={onCopy}
                onMove={onMove}
              />
            ) : (
              <div
                key={child.id}
                className={`tree-item ${selectedId === child.id ? "selected" : ""}`}
                onClick={() => onSelect(child.id)}
                style={{ display: "flex", alignItems: "center" }}
              >
                <span style={{ marginRight: 8 }}>📄</span>
                <span>{child.name}</span>

                <span style={{ marginLeft: "10px" }}>
                  <ActionMenu id={child.id} onRename={onRename} onCopy={onCopy} onMove={onMove} />
                </span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
