import { ConfirmDialog } from '@kanban/dialog';
import { generateTheme } from '@kanban/theme';
import { MoreVertOutlined } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { useActiveBoard } from '../../services';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function BoardMore({ disabled }: { disabled: boolean }) {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    push,
    query: { board_id },
  } = useRouter();

  const { activeBoard } = useActiveBoard(board_id as string);

  function closeMenu() {
    setIsMoreMenuOpen(false);
    setAnchorEl(null);
  }

  const [isConfirmDeleteBoardDialogOpen, setIsConfirmDeleteBoardDialogOpen] =
    useState<boolean>(false);

  function deleteBoard() {
    if (activeBoard) setIsConfirmDeleteBoardDialogOpen(true);
    else alert('No active board');
  }

  const [isEditBoardDialogOpen, setIsEditBoardDialogOpen] =
    useState<boolean>(false);
  function editBoard() {
    if (activeBoard) setIsEditBoardDialogOpen(true);
  }

  return (
    <>
      <ConfirmDialog
        closeDialog={() => setIsConfirmDeleteBoardDialogOpen(false)}
        dialogMessage={`Are you sure you want to delete the " ${activeBoard?.board_name} " board? This action will remove all columns and tasks and cannot be reversed.`}
        isDialogOpen={isConfirmDeleteBoardDialogOpen}
        confirmButton="Delete"
        danger
        dialogTitle="Delete this board?"
        confirm={() => {
          alert(`delete activeBoard element`);
          push('/');
        }}
      />

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
        <MenuItem
          onClick={() => {
            closeMenu();
            editBoard();
          }}
          sx={{
            ...generateTheme().typography.caption,
            color: generateTheme().common.medium_grey,
          }}
        >
          Edit Board
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            deleteBoard();
          }}
          sx={{
            color: generateTheme().palette.error.main,
            ...generateTheme().typography.caption,
          }}
        >
          Delete Board
        </MenuItem>
      </Menu>
    </>
  );
}
