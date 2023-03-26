import { generateTheme } from '@kanban/theme';
import { Menu, MenuItem } from '@mui/material';

export default function TaskMore({
  isMenuOpen,
  anchorEl,
  closeMenu,
  handleEdit,
  handleDelete,
}: {
  isMenuOpen: boolean;
  anchorEl: HTMLElement;
  closeMenu: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
}) {
  return (
    <>
      <Menu
        elevation={0}
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={closeMenu}
      >
        <MenuItem
          onClick={() => {
            closeMenu();
            handleEdit();
          }}
          sx={{
            ...generateTheme().typography.caption,
            color: generateTheme().common.medium_grey,
          }}
        >
          Edit Task
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            handleDelete();
          }}
          sx={{
            color: generateTheme().palette.error.main,
            ...generateTheme().typography.caption,
          }}
        >
          Delete Task
        </MenuItem>
      </Menu>
    </>
  );
}
