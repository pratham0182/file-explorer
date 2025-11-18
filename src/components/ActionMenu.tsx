"use client";

import { useState } from "react";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function ActionMenu({
  id,
  onRename,
  onCopy,
  onMove,
}: {
  id: string;
  onRename: (id: string) => void;
  onCopy: (id: string) => void;
  onMove: (id: string) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu = (e: any) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="Actions">
        <IconButton size="small" onClick={openMenu}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            closeMenu();
            onRename(id);
          }}
        >
          Rename
        </MenuItem>

        <MenuItem
          onClick={() => {
            closeMenu();
            onCopy(id);
          }}
        >
          Copy
        </MenuItem>

        <MenuItem
          onClick={() => {
            closeMenu();
            onMove(id);
          }}
        >
          Move
        </MenuItem>
      </Menu>
    </>
  );
}
