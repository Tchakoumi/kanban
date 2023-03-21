import { generateTheme } from '@kanban/theme';
import { MoreVertOutlined } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { useState } from 'react';

export default function BoardMore({
  disabled,
  editBoard,
  deleteBoard,
}: {
  disabled: boolean;
  editBoard: () => void;
  deleteBoard: () => void;
}) {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function closeMenu() {
    setIsMoreMenuOpen(false);
    setAnchorEl(null);
  }

  return (
    <>
      <Tooltip arrow title="more">
        <IconButton
          disabled={disabled}
          size="small"
          onClick={(event) => {
            setIsMoreMenuOpen(true);
            setAnchorEl(event.currentTarget);
          }}
        >
          <MoreVertOutlined />
        </IconButton>
      </Tooltip>
      <Menu
        elevation={0}
        anchorEl={anchorEl}
        open={isMoreMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: 60,
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={editBoard}>Edit Board</MenuItem>
        <MenuItem
          onClick={deleteBoard}
          sx={{ color: generateTheme().palette.error.main }}
        >
          Delete Board
        </MenuItem>
      </Menu>
    </>
  );
}
